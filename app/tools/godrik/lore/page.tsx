import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import LoreEditor from './LoreEditor';

export default async function Page() {
  const user = await currentUser();
  const admin = process.env.GODRIK_ADMIN_EMAIL;
  const allowed = user && (!admin || user.emailAddresses?.[0]?.emailAddress === admin);

  if (!user) return (
    <div>
      <h2 className="text-2xl font-semibold">Sign in required</h2>
      <p className="text-sm text-gray-600">You must be signed in to edit Godrik's lore.</p>
    </div>
  );

  if (!allowed) return (
    <div>
      <h2 className="text-2xl font-semibold">Forbidden</h2>
      <p className="text-sm text-gray-600">Your account is not authorized to edit lore.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Godrik Lore Editor</h2>
      <p className="text-sm text-gray-600">Add, remove, and manage Godrik's lore entries. Changes update the DB and the exported YAML.</p>
      <LoreEditor />
    </div>
  );
}
