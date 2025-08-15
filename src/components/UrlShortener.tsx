import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink, BarChart3, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.jpg";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

export const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const { toast } = useToast();

  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const shortCode = generateShortCode();
      const newShortenedUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        shortUrl: `https://short.ly/${shortCode}`,
        clicks: 0,
        createdAt: new Date(),
      };

      setShortenedUrls([newShortenedUrl, ...shortenedUrls]);
      setOriginalUrl("");
      setIsLoading(false);

      toast({
        title: "URL Shortened!",
        description: "Your short URL has been created successfully",
      });
    }, 1000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Shorten URLs.<br />Track Everything.
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform long URLs into powerful short links with comprehensive analytics. 
            Perfect for marketing campaigns, social media, and tracking engagement.
          </p>

          {/* URL Shortener Form */}
          <Card className="max-w-2xl mx-auto backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Create Short Link</CardTitle>
              <CardDescription>
                Enter a long URL to generate a short, trackable link
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 text-black">
              <Input
                type="url"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="flex-1 h-12 text-lg text-black placeholder-black"
                onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
              />
              <Button 
                onClick={handleShorten}
                disabled={isLoading}
                className="h-12 px-8 text-lg font-semibold text-black"
                size="lg"
              >
                {isLoading ? "Shortening..." : "Shorten URL"}
              </Button>
            </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent URLs Section */}
      {shortenedUrls.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Your Short Links</h2>
          <div className="space-y-4">
            {shortenedUrls.map((url) => (
              <Card key={url.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-mono font-bold text-primary">
                        {url.shortUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground truncate mb-2">
                      {url.originalUrl}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{url.clicks} clicks</span>
                      <span>Created {url.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage and track your links
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, geographic data, referrers, and user engagement with detailed insights.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">QR Code Generation</h3>
              <p className="text-muted-foreground">
                Automatically generate QR codes for your short links, perfect for offline marketing.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Custom Aliases</h3>
              <p className="text-muted-foreground">
                Create branded short links with custom aliases that match your brand identity.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};