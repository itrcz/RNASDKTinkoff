
Pod::Spec.new do |s|
  s.name         = "RNASDKTinkoff"
  s.version      = "1.0.0"
  s.summary      = "RNASDKTinkoff"
  s.description  = <<-DESC
                  RNASDKTinkoff
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "jleed@me.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/jleed/RNASDKTinkoff.git", :tag => "master" }
  s.source_files  = "RNASDKTinkoff/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  