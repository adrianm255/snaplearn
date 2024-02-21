class OpenaiService
  EMBEDDINGS_MODEL = 'text-embedding-3-large'
  AUDIO_TRANSCRIPTION_MODEL = 'whisper-1'
  COMPLETIONS_MODEL = 'gpt-4'

  SYSTEM_PROMPT = "Respond to the following question using only the information provided below. 
  Your answer should be concise, directly addressing the question with relevant information. 
  Paraphrase the content to maintain originality and clarity, using direct quotations minimally 
  and formatted appropriately with quotation marks or blockquotes. Structure your response with 
  HTML for clarity and emphasis: employ <h3> (or smaller) for headings, <ul> for unordered lists, 
  <ol> for ordered lists, <strong> for key terms, and <em> for emphasis. If the answer is partially 
  covered by the content, clearly state the extent of the information available. Respond with 
  'I could not find an answer' if the content does not contain relevant information. 
  Avoid directly referencing the content (e.g., do not use phrases like 'According to the content'). 
  Instead, integrate the information seamlessly into your response, maintaining relevance and brevity. 
  Your answer should be to the point, avoiding unnecessary detail or tangential information. 
  If the question's scope exceeds the content provided, provide a focused response based on the 
  available information, explicitly stating any limitations due to the scope of the provided content."

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