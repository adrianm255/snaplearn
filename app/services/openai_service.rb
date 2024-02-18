class OpenaiService
  EMBEDDINGS_MODEL = 'text-embedding-3-large'
  AUDIO_TRANSCRIPTION_MODEL = 'whisper-1'
  COMPLETIONS_MODEL = 'gpt-4'

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
    # " When providing the answer, make sure appropriate HTML formatting is used when necessary for things such as titles, lists, list items etc. For heading tags use only from <h3> and smaller."
    system_prompt = 'Use the below content to answer the subsequent question. Do not refer directly to the content when giving an answer (e.g. do not say things like "The content provides" or "The content mentions" or "The provided content"). When appropriate, use HTML formatting in the answer for things such as titles, lists, list items etc. For heading tags use only from <h3> and smaller. If the answer cannot be found in the provided content, write "I could not find an answer."'
    messages = [
      {'role': 'system', 'content': system_prompt + " Content: " + relevant_sections.join(' ')},
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