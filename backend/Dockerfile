
# Use Ruby 3.3.7
ARG RUBY_VERSION=3.3.7
FROM ruby:$RUBY_VERSION-slim

# Rails app lives here
WORKDIR /rails

# Install base packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential ca-certificates default-mysql-client default-libmysqlclient-dev git libyaml-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
COPY Gemfile Gemfile.lock ./

# Configure bundler and install gems with retry logic
RUN bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3

# Copy application code
COPY . .

# Copy entrypoint to a path outside the volume mount (/rails) so the Windows
# bind mount can't overwrite it with a CRLF version at runtime
RUN cp bin/docker-entrypoint /usr/local/bin/docker-entrypoint && \
    sed -i 's/\r$//' /usr/local/bin/docker-entrypoint && \
    chmod +x /usr/local/bin/docker-entrypoint

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# Entrypoint prepares the database
ENTRYPOINT ["/usr/local/bin/docker-entrypoint"] # Use the copied entrypoint to avoid issues with Windows bind mounts

# Start the server by default
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]