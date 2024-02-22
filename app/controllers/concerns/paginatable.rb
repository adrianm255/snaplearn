module Paginatable
  extend ActiveSupport::Concern

  private

  def paginate(scope, default_limit: 5, default_start: 0)
    limit = (params[:limit] || default_limit).to_i
    start = (params[:start] || default_start).to_i

    total_count = scope.count
    scope = scope.limit(limit).offset(start)
    
    [scope, total_count]
  end
end