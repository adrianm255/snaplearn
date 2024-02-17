require 'nokogiri'

class RichTextParser
  MAX_CHUNK_SIZE = 10_000 # TODO should be based on number of tokens - max 8191

  def initialize(html_content)
    @html_content = html_content
    @chunks = []
  end

  def chunk_by_sections
    doc = Nokogiri::HTML.fragment('<div id="root">' + @html_content + '</div>')

    current_chunk = {
      title: '',
      content: ''
    }
    last_node_was_heading = false

    doc.css('#root > *').each do |node|
      if node.name == 'h1' || node.name == 'h2'
        current_chunk_content = current_chunk[:content].strip
        @chunks << current_chunk unless last_node_was_heading && !current_chunk_content.empty?
        current_chunk = {
          title: node.text,
          content: ''
        }
        last_node_was_heading = true
      else
        last_node_was_heading = false
        node.children.each do |child_node|
          child_node_content = child_node.text.strip
          unless child_node_content.empty?
            current_chunk[:content] += ' ' + child_node_content
          end
        end
      end
    end

    @chunks << current_chunk unless current_chunk[:content].empty?

    @chunks = @chunks.select{ |chunk| !chunk[:content].strip.empty? }
    @chunks
  end

  private

  def process_current_chunk(chunk)
    if chunk.length > MAX_CHUNK_SIZE
      split_and_add_chunk(chunk)
    else
      @chunks << chunk.strip
    end
  end

  def split_and_add_chunk(chunk)
    words = chunk.split(/\s+/)
    current_chunk = ''

    words.each do |word|
      if (current_chunk.length + word.length) > MAX_CHUNK_SIZE
        @chunks << current_chunk unless current_chunk.empty?
        current_chunk = word
      else
        current_chunk += " " unless current_chunk.empty?
        current_chunk += word
      end
    end

    @chunks << current_chunk unless current_chunk.empty?
  end
end
