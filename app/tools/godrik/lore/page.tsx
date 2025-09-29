import React from 'react';
import LoreEditor from './LoreEditor';

export default function Page() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Godrik Lore Editor</h2>
      <p className="text-sm text-gray-600">Add, remove, and manage Godrik's lore entries. Changes update <code>lib/godrik/lore.yaml</code> and will be used by the Godrik generator.</p>
      <LoreEditor />
    </div>
  );
}
