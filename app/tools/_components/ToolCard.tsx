'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import Link from 'next/link';

export function ToolCard({ title, description, href, emoji = '🛠' }: { title: string; description: string; href: string; emoji?: string }) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-lg transition-shadow p-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{emoji}</div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Open tool →</CardContent>
      </Card>
    </Link>
  );
}
