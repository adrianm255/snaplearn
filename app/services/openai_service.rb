class OpenaiService
  EMBEDDINGS_MODEL = 'text-embedding-3-large'
  AUDIO_TRANSCRIPTION_MODEL = 'whisper-1'
  COMPLETIONS_MODEL = 'gpt-4'

  SYSTEM_PROMPT = "Use the content below to answer the following question. Aim to paraphrase the information 
  to ensure clarity and originality in your response. Direct quotations should be used sparingly and formatted 
  with quotation marks or as blockquotes. When structuring your answer, employ HTML formatting for clarity 
  and emphasis: use <h3> (or smaller) for headings, <ul> for unordered lists, <ol> for ordered lists, 
  <strong> for important terms, and <em> for emphasis. If the answer is only partially covered by the 
  provided content, outline the available information and indicate any limitations. In cases where the 
  content does not contain relevant information, respond with 'I could not find an answer.' 
  Do not reference the content directly in your answer (e.g., avoid phrases like 'The content provides'). 
  Instead, integrate the information seamlessly into your response, maintaining relevance and brevity. 
  If the question's scope exceeds the content provided, acknowledge the partial response while emphasizing 
  the need for additional information not contained within the provided content."

  def initialize()
    @client = OpenAI::Client.new
  end

  def get_embeddings(input)
    response = @client.embeddings(
      parameters: {
        model: EMBEDDINGS_MODEL,
        input: input
      }
    )

    response['data']
  end

  def batch_embed(chunks)
    batch_size = 100 # TODO need to batch by token count - max count 8191
    embeddings = []

    chunks.each_slice(batch_size) do |chunk_batch|
      response = get_embeddings(chunk_batch.map { |chunk| (chunk['title'] || '') + ' ' + chunk['content'] })
      embeddings.concat(response.map.with_index do |emb, i|
        chunk = chunk_batch[emb['index']]
        chunk.merge({
          embedding: emb['embedding']
        })
      end)
    end

    embeddings
  end

  def get_audio_transcription(audio_file_path)
    response = @client.audio.transcribe(
      parameters: {
        model: AUDIO_TRANSCRIPTION_MODEL,
        file: File.open(audio_file_path, "rb"),
        # response_format: 'srt'  # use for SRT format
      }
    )

    response['text']
  end

  def ask_question(user_prompt, relevant_sections, session_id, stream_proc, &after_process)
    messages = [
      {'role': 'system', 'content': SYSTEM_PROMPT + " Content: " + relevant_sections.join(' ')},
      {'role': 'user', 'content': user_prompt}
    ]

    response = @client.chat(
      parameters: {
        model: COMPLETIONS_MODEL,
        messages: messages,
        temperature: 0.0,
        stream: stream_proc
      }
    )

    after_process.call if block_given?
  end
end