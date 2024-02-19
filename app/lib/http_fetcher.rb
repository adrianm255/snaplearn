require 'net/http'

module HttpFetcher
  def self.fetch(uri, limit = 10)
    raise ArgumentError, 'too many HTTP redirects' if limit == 0

    response = Net::HTTP.get_response(uri)

    case response
    when Net::HTTPSuccess then
      response
    when Net::HTTPRedirection then
      location = response['location']
      warn "redirected to #{location}"
      fetch(URI(location), limit - 1)
    else
      response
    end
  end
end