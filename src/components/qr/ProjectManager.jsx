import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, History, Settings, Save, Clock, Shield, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectManager({ qrAsset, onUpdateAsset, onRestoreVersion, onInvite }) {
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    if (qrAsset?.id) {
      loadVersions();
    }
  }, [qrAsset?.id]);

  const loadVersions = async () => {
    setLoadingVersions(true);
    try {
      const vs = await base44.entities.QrVersion.filter({ asset_id: qrAsset.id }, '-version_number', 20);
      setVersions(vs);
    } catch (e) {
      console.error("Failed to load versions", e);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!qrAsset) return;
    try {
      const nextVer = (versions[0]?.version_number || 0) + 1;
      await base44.entities.QrVersion.create({
        asset_id: qrAsset.id,
        version_number: nextVer,
        payload: qrAsset.payload,
        design_config: qrAsset.design_config || qrAsset.customization,
        change_log: `Manual save v${nextVer}`
      });
      toast.success(`Version ${nextVer} saved`);
      loadVersions();
    } catch (e) {
      toast.error("Failed to save version");
    }
  };

  const handleInvite = () => {
    if (!newMemberEmail) return;
    if (onInvite) onInvite(newMemberEmail, 'editor');
    setNewMemberEmail('');
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          Project Management
        </CardTitle>
        <CardDescription className="text-slate-400">
          {qrAsset?.name || 'Untitled Project'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="team">
          <TabsList className="bg-slate-950 border border-slate-800 w-full">
            <TabsTrigger value="team" className="flex-1">Team</TabsTrigger>
            <TabsTrigger value="versions" className="flex-1">History</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="teammate@example.com" 
                value={newMemberEmail}
                onChange={e => setNewMemberEmail(e.target.value)}
                className="bg-slate-950 border-slate-700"
              />
              <Button onClick={handleInvite} size="icon" className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Active Members</h4>
              {qrAsset?.shared_with?.map((email, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`} />
                      <AvatarFallback>{email[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-300">{email}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Editor</Badge>
                </div>
              ))}
              {(!qrAsset?.shared_with || qrAsset.shared_with.length === 0) && (
                <p className="text-sm text-slate-500 italic">No team members yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="versions" className="mt-4">
            <div className="flex justify-between mb-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mt-2">Version History</h4>
              <Button onClick={handleSaveVersion} size="sm" variant="outline" className="h-8 gap-2">
                <Save className="w-3 h-3" /> Save Snapshot
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-2">
                {versions.map((ver) => (
                  <div key={ver.id} className="p-3 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="secondary" className="bg-slate-800 text-cyan-400">v{ver.version_number}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ver.created_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{ver.change_log || 'No description'}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        className="w-full h-6 text-xs border border-slate-700 hover:bg-cyan-900/20 hover:text-cyan-400"
                        onClick={() => onRestoreVersion && onRestoreVersion(ver)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
                {versions.length === 0 && !loadingVersions && (
                  <p className="text-sm text-slate-500 text-center py-8">No saved versions.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Project Name</label>
              <Input 
                value={qrAsset?.name || ''} 
                onChange={e => onUpdateAsset({ ...qrAsset, name: e.target.value })}
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Access Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['private', 'team', 'public'].map(level => (
                  <Button
                    key={level}
                    variant={qrAsset?.access_policy === level ? 'default' : 'outline'}
                    onClick={() => onUpdateAsset({ ...qrAsset, access_policy: level })}
                    className={`capitalize ${qrAsset?.access_policy === level ? 'bg-cyan-600' : 'border-slate-700'}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <Button variant="destructive" className="w-full">Archive Project</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}