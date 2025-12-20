import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import RoyalLoader from "@/components/shared/RoyalLoader";

export default function ProjectUpdates() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);

    const fetchNotionStatus = async () => {
        setLoading(true);
        try {
            // Try to list resources to check connection
            const { data } = await base44.functions.invoke("notionOps", { action: "list_resources" });
            setConnected(data.connected);
            if (data.results) {
                setPages(data.results);
                if (data.results.length > 0) setSelectedPage(data.results[0].id);
            }
        } catch (error) {
            console.error("Notion check failed:", error);
            // Likely 401 if not connected or 500 if error
            if (error.response?.status === 401) {
                setConnected(false);
            } else {
                toast.error("Failed to connect to Notion service");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotionStatus();
    }, []);

    const handleSend = async () => {
        if (!selectedPage || !content) {
            toast.error("Please select a parent page and enter content");
            return;
        }

        setSending(true);
        try {
            await base44.functions.invoke("notionOps", {
                action: "post_update",
                payload: {
                    parentId: selectedPage,
                    title: title || `Update ${new Date().toLocaleDateString()}`,
                    content: content
                }
            });
            toast.success("Update posted to Notion!");
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Post failed:", error);
            toast.error("Failed to post update: " + error.message);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><RoyalLoader text="Checking Notion Connection..." /></div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        Project Updates
                    </h1>
                    <p className="text-slate-400">Push updates directly to your Notion workspace.</p>
                </div>

                {!connected ? (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="pt-6 text-center space-y-4">
                            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                            <h3 className="text-xl font-bold">Notion Not Connected</h3>
                            <p className="text-slate-400">Please authorize the Notion connector to continue.</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10">
                                <RefreshCw className="w-4 h-4 mr-2" /> Check Connection Again
                            </Button>
                            <p className="text-xs text-slate-500 mt-4">If you haven't authorized yet, please check the chat for the authorization card.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar / Config */}
                        <Card className="bg-white/5 border-white/10 md:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Target Page</CardTitle>
                                <CardDescription>Select a parent page</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select value={selectedPage} onValueChange={setSelectedPage}>
                                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                        <SelectValue placeholder="Select Page" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-white/10 text-white">
                                        {pages.map(page => (
                                            <SelectItem key={page.id} value={page.id} className="focus:bg-indigo-500/20">
                                                {page.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {pages.length === 0 && (
                                    <p className="text-xs text-amber-500">
                                        No pages found. Please ensure you granted access to pages when authorizing Notion.
                                    </p>
                                )}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-green-400 text-xs">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Connected to Notion
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editor */}
                        <Card className="bg-white/5 border-white/10 md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Compose Update</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-slate-500">Update Title</label>
                                    <Input 
                                        placeholder="Weekly Update..." 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-black/50 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-slate-500">Content</label>
                                    <Textarea 
                                        placeholder="Describe progress, milestones, and next steps..." 
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)}
                                        className="min-h-[200px] bg-black/50 border-white/10 text-white placeholder:text-slate-600 font-sans"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button 
                                        onClick={handleSend} 
                                        disabled={sending || !selectedPage}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                                    >
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                        Post Update
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}