'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Grid } from '@/components/layout/grid';

export default function DesignSystemDemo() {
  const [inputValue, setInputValue] = useState('');

  const Sw = ({ name, v }: { name: string; v: string }) => (
    <div className="flex items-center gap-3">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `var(${v})`,
          border: '1px solid var(--color-border)',
        }}
      />
      <span className="text-fg">{name}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Container>
        <Section spacing="lg">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Design System Demo</h1>
          </div>

          {/* Sanity Test Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Sw name="Primary Blue" v="--color-primary-blue" />
            <Sw name="Primary Red" v="--color-primary-red" />
            <Sw name="Success" v="--color-success" />
            <Sw name="Warning" v="--color-warning" />
            <Sw name="Danger" v="--color-danger" />
            <Sw name="Muted" v="--color-muted" />
          </div>

          {/* Buttons Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🚀</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
              </div>
            </div>
          </Section>

          {/* Form Elements Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
            <div className="max-w-md space-y-4">
              <div>
                <Label htmlFor="demo-input">Input Label</Label>
                <Input
                  id="demo-input"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="demo-input-2">Another Input</Label>
                <Input
                  id="demo-input-2"
                  placeholder="Another input field..."
                  disabled
                />
              </div>
            </div>
          </Section>

          {/* Cards Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Cards</h2>
            <Grid cols={3} gap="md">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Card Header</h3>
                </CardHeader>
                <CardContent>
                  <p>
                    This is the card content area. You can put any content here.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">Simple Card</h3>
                  <p>This card only has content, no header or footer.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Interactive Card</h3>
                </CardHeader>
                <CardContent>
                  <p>This card has interactive elements.</p>
                  <div className="mt-4 space-y-2">
                    <Button variant="primary" size="sm">
                      Primary Action
                    </Button>
                    <Button variant="ghost" size="sm">
                      Secondary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Section>

          {/* Badges Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          {/* Layout Components Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Layout Components</h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Grid System</h3>
              <Grid cols={4} gap="md">
                <div className="bg-border p-4 rounded text-center">1</div>
                <div className="bg-border p-4 rounded text-center">2</div>
                <div className="bg-border p-4 rounded text-center">3</div>
                <div className="bg-border p-4 rounded text-center">4</div>
              </Grid>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Container Sizes</h3>
              <div className="space-y-4">
                <Container size="sm" className="bg-border p-4 rounded">
                  <p>Small Container (max-w-3xl)</p>
                </Container>
                <Container size="md" className="bg-border p-4 rounded">
                  <p>Medium Container (max-w-4xl)</p>
                </Container>
                <Container size="lg" className="bg-border p-4 rounded">
                  <p>Large Container (max-w-6xl) - Current</p>
                </Container>
              </div>
            </div>
          </Section>

          {/* Color Tokens Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Color Tokens</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                ['Primary Red', '--color-primary-red'],
                ['Primary Blue', '--color-primary-blue'],
                ['Success', '--color-success'],
                ['Warning', '--color-warning'],
                ['Danger', '--color-danger'],
                ['Muted', '--color-muted'],
              ].map(([name, cssVar]) => (
                <div key={name as string} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `var(${cssVar as string})`,
                      border: '1px solid var(--color-border)',
                    }}
                  />
                  <span className="text-fg">{name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Typography Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Typography</h2>
            <div className="space-y-4">
              <h1 className="text-4xl">Heading 1 (text-4xl)</h1>
              <h2 className="text-3xl">Heading 2 (text-3xl)</h2>
              <h3 className="text-2xl">Heading 3 (text-2xl)</h3>
              <h4 className="text-xl">Heading 4 (text-xl)</h4>
              <p className="text-base">Base text (text-base)</p>
              <p className="text-sm">Small text (text-sm)</p>
              <p className="text-xs">Extra small text (text-xs)</p>
            </div>
          </Section>

          {/* Spacing Section */}
          <Section spacing="md">
            <h2 className="text-2xl font-semibold mb-6">Spacing</h2>
            <div className="space-y-4">
              <div className="bg-border p-1 rounded">Space 1 (0.25rem)</div>
              <div className="bg-border p-2 rounded">Space 2 (0.5rem)</div>
              <div className="bg-border p-4 rounded">Space 4 (1rem)</div>
              <div className="bg-border p-6 rounded">Space 6 (1.5rem)</div>
              <div className="bg-border p-8 rounded">Space 8 (2rem)</div>
              <div className="bg-border p-12 rounded">Space 12 (3rem)</div>
            </div>
          </Section>
        </Section>
      </Container>
    </div>
  );
}
