require 'pdf-reader'
require 'stringio'

class PdfParser
  def initialize(file)
    @pdf_file = file
  end

  def extract_content
    pdf_io = download_pdf
    extract_pdf_content(pdf_io)
  end

  private

  def download_pdf
    pdf_data = @pdf_file.download
    StringIO.new(pdf_data)
  end

  def ends_mid_sentence(text)
    !text.strip.match?(/[.?!]\z/)
  end

  def extract_pdf_content(pdf_io)
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
  end
end
