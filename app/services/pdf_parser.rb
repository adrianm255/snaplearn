require 'uri'
require 'pdf-reader'
require 'stringio'

class PdfParser
  def initialize(file_url)
    @pdf_file_url = file_url
  end

  def extract_content
    pdf_io = download_pdf
    extract_pdf_content(pdf_io)
  end

  private

  def download_pdf
    file_io = nil
    uri = URI(@pdf_file_url)
    response = HttpFetcher.fetch(uri)
    if response.is_a?(Net::HTTPSuccess)
      file_data = response.body
      file_io = StringIO.new(file_data)
    else
      puts "Failed to download file: #{response.code} #{response.message}"
    end
    file_io
  end

  def ends_mid_sentence(text)
    !text.strip.match?(/[.?!]\z/)
  end

  def extract_pdf_content(pdf_io)
    return [] if pdf_io.nil?

    reader = PDF::Reader.new(pdf_io)
    content = []

    reader.pages.each_with_index do |page, index|
      current_page_text = page.text

      if ends_mid_sentence(current_page_text) && reader.pages[index + 1]
        next_page_text = reader.pages[index + 1].text
        end_of_paragraph = next_page_text.match(/.*?[.?!](\s|\z)/m)
        continuation = end_of_paragraph ? end_of_paragraph[0] : ""
        content << { 'content': (current_page_text + continuation) }
      else
        content << { 'content': current_page_text }
      end
    end

    content
  ensure
    pdf_io.close if pdf_io
  end
end
