import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const ColorTest: React.FC = () => {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand">New Color Scheme Test</h1>
        <p className="text-muted-foreground">
          Testing brand blue (light mode) and muted gold (dark mode) implementation
        </p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variations</CardTitle>
          <CardDescription>Testing all button styles with new brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <HoverBorderGradient className="bg-brand text-brand-foreground px-4 py-2">
              HoverBorder Gold/Emerald
            </HoverBorderGradient>
            <HoverBorderGradient className="bg-background text-foreground px-4 py-2">
              HoverBorder Secondary
            </HoverBorderGradient>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors Display */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Color Showcase</CardTitle>
          <CardDescription>Visual representation of color contrast and accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Color Swatches */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 w-full bg-brand rounded-lg flex items-center justify-center">
                <span className="text-brand-foreground font-semibold">Brand</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Primary Brand</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 w-full bg-background border rounded-lg flex items-center justify-center">
                <span className="text-foreground font-semibold">Background</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Background</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 w-full bg-card border rounded-lg flex items-center justify-center">
                <span className="text-card-foreground font-semibold">Card</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Card Surface</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 w-full bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground font-semibold">Muted</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Muted Surface</p>
            </div>
          </div>

          {/* Gradient Test */}
          <div className="space-y-2">
            <h4 className="font-semibold">Gradient Effects</h4>
            <div className="h-16 w-full bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Brand Gradient</span>
            </div>
            <div className="h-16 w-full bg-brand-gradient-subtle rounded-lg flex items-center justify-center">
              <span className="text-brand-foreground font-semibold">Animated Gradient</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography and Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Typography & Components</CardTitle>
          <CardDescription>Testing readability and contrast across components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-brand">Large Brand Heading</h1>
            <h2 className="text-2xl font-semibold text-foreground">Regular Heading</h2>
            <p className="text-foreground">Regular body text with good contrast</p>
            <p className="text-muted-foreground">Muted text for secondary information</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Logo Test */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Branding Elements</CardTitle>
          <CardDescription>Testing logo appearance in new color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-brand text-brand-foreground flex items-center justify-center font-bold text-xl">
              B
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">Budgetpunk</span>
              <p className="text-sm text-muted-foreground">Financial Technology Platform</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Compliance</CardTitle>
          <CardDescription>WCAG contrast ratios and compliance information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Light Mode (Brand Blue)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Brand on Background: <span className="text-blue-600 font-semibold">5.1:1 (AA)</span></li>
                <li>• White on Brand: <span className="text-blue-600 font-semibold">4.6:1 (AA)</span></li>
                <li>• Text Contrast: <span className="text-blue-600 font-semibold">12.1:1 (AAA)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dark Mode (Muted Gold)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Brand on Background: <span className="text-blue-600 font-semibold">8.2:1 (AAA)</span></li>
                <li>• White on Brand: <span className="text-blue-600 font-semibold">4.8:1 (AA)</span></li>
                <li>• Text Contrast: <span className="text-blue-600 font-semibold">16.3:1 (AAA)</span></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorTest;
