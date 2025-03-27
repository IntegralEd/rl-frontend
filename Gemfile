source "https://rubygems.org"

gem "jekyll", "~> 4.2.0"
gem "minima", "~> 2.5"
gem "csv"  # Required for Ruby 3.4+
gem "logger"  # Will be required for Ruby 3.5+
gem "base64"  # Required for Ruby 3.4+
gem "bigdecimal"  # Required for Ruby 3.4+

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# For Windows Jekyll watchers
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Required on newer Ruby for local server
gem "webrick", "~> 1.7"
