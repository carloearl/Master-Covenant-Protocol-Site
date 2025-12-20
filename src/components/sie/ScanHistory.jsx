import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ArrowRight } from "lucide-react";

export default function ScanHistory({ onSelectScan }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        base44.entities.ScanRun.list({ sort: { started_at: -1 }, limit: 20 }).then(res => {
            setHistory(res.data);
        });
    }, []);

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">Scan History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800">
                            <TableHead className="text-slate-400">Date</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400">Issues (Crit/Warn)</TableHead>
                            <TableHead className="text-slate-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map(run => {
                            const totalCrit = (run.nav_critical_count || 0) + (run.route_critical_count || 0) + (run.sitemap_critical_count || 0) + (run.backend_critical_count || 0);
                            const totalWarn = (run.nav_warning_count || 0) + (run.route_warning_count || 0) + (run.sitemap_warning_count || 0) + (run.backend_warning_count || 0);
                            
                            return (
                                <TableRow key={run.id} className="border-slate-800">
                                    <TableCell className="text-slate-300">{new Date(run.started_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={
                                            run.status === 'success' ? 'bg-green-500/10 text-green-500' : 
                                            run.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                                            'bg-red-500/10 text-red-500'
                                        }>
                                            {run.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-300">{totalCrit} / {totalWarn}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" onClick={() => onSelectScan(run)}>
                                            <Eye className="w-4 h-4 mr-2" /> View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}