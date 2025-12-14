"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { overtimeRuleApi, latenessRuleApi } from "@/lib/api/time-management";
import { OvertimeRule, LatenessRule, OvertimeRuleType } from "@/types/time-management";
import { Plus, Edit, Trash2, Settings, Clock, AlertTriangle } from "lucide-react";

export default function PoliciesPage() {
  const [overtimeRules, setOvertimeRules] = useState<OvertimeRule[]>([]);
  const [latenessRules, setLatenessRules] = useState<LatenessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [overtimeDialogOpen, setOvertimeDialogOpen] = useState(false);
  const [latenessDialogOpen, setLatenessDialogOpen] = useState(false);
  const [editingOvertimeRule, setEditingOvertimeRule] = useState<OvertimeRule | null>(null);
  const [editingLatenessRule, setEditingLatenessRule] = useState<LatenessRule | null>(null);

  const [overtimeFormData, setOvertimeFormData] = useState({
    name: "",
    type: OvertimeRuleType.WEEKDAY,
    multiplier: 1.5,
    minimumMinutes: 0,
    requiresApproval: false,
  });

  const [latenessFormData, setLatenessFormData] = useState({
    name: "",
    gracePeriodMinutes: 0,
    thresholds: [{ minutes: 15, penalty: "Warning" }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [overtime, lateness] = await Promise.all([
        overtimeRuleApi.getAll(),
        latenessRuleApi.getAll(),
      ]);
      setOvertimeRules(overtime);
      setLatenessRules(lateness);
    } catch (error) {
      console.error("Failed to load policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOvertimeRule) {
        await overtimeRuleApi.update(editingOvertimeRule._id, overtimeFormData);
      } else {
        await overtimeRuleApi.create(overtimeFormData);
      }
      await loadData();
      handleCloseOvertimeDialog();
    } catch (error) {
      console.error("Failed to save overtime rule:", error);
    }
  };

  const handleLatenessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLatenessRule) {
        await latenessRuleApi.update(editingLatenessRule._id, latenessFormData);
      } else {
        await latenessRuleApi.create(latenessFormData);
      }
      await loadData();
      handleCloseLatenessDialog();
    } catch (error) {
      console.error("Failed to save lateness rule:", error);
    }
  };

  const handleDeleteOvertimeRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this overtime rule?")) return;
    try {
      await overtimeRuleApi.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete overtime rule:", error);
    }
  };

  const handleDeleteLatenessRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lateness rule?")) return;
    try {
      await latenessRuleApi.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete lateness rule:", error);
    }
  };

  const handleEditOvertimeRule = (rule: OvertimeRule) => {
    setEditingOvertimeRule(rule);
    setOvertimeFormData({
      name: rule.name,
      type: rule.type,
      multiplier: rule.multiplier,
      minimumMinutes: rule.minimumMinutes,
      requiresApproval: rule.requiresApproval,
    });
    setOvertimeDialogOpen(true);
  };

  const handleEditLatenessRule = (rule: LatenessRule) => {
    setEditingLatenessRule(rule);
    setLatenessFormData({
      name: rule.name,
      gracePeriodMinutes: rule.gracePeriodMinutes,
      thresholds: rule.thresholds,
    });
    setLatenessDialogOpen(true);
  };

  const handleCloseOvertimeDialog = () => {
    setOvertimeDialogOpen(false);
    setEditingOvertimeRule(null);
    setOvertimeFormData({
      name: "",
      type: OvertimeRuleType.WEEKDAY,
      multiplier: 1.5,
      minimumMinutes: 0,
      requiresApproval: false,
    });
  };

  const handleCloseLatenessDialog = () => {
    setLatenessDialogOpen(false);
    setEditingLatenessRule(null);
    setLatenessFormData({
      name: "",
      gracePeriodMinutes: 0,
      thresholds: [{ minutes: 15, penalty: "Warning" }],
    });
  };

  const addThreshold = () => {
    setLatenessFormData({
      ...latenessFormData,
      thresholds: [...latenessFormData.thresholds, { minutes: 0, penalty: "" }],
    });
  };

  const updateThreshold = (index: number, field: "minutes" | "penalty", value: string | number) => {
    const newThresholds = [...latenessFormData.thresholds];
    newThresholds[index][field] = value as never;
    setLatenessFormData({ ...latenessFormData, thresholds: newThresholds });
  };

  const removeThreshold = (index: number) => {
    setLatenessFormData({
      ...latenessFormData,
      thresholds: latenessFormData.thresholds.filter((_, i) => i !== index),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Time Management Policies</h1>
          <p className="text-muted-foreground">
            Configure overtime and lateness rules for your organization
          </p>
        </div>

        {/* Overtime Rules Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Overtime Rules
                </CardTitle>
                <CardDescription>
                  Define how overtime is calculated and approved
                </CardDescription>
              </div>
              <Dialog open={overtimeDialogOpen} onOpenChange={setOvertimeDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingOvertimeRule(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <form onSubmit={handleOvertimeSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingOvertimeRule ? "Edit Overtime Rule" : "Create Overtime Rule"}
                      </DialogTitle>
                      <DialogDescription>
                        Configure overtime calculation parameters
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="overtime-name">Rule Name</Label>
                        <Input
                          id="overtime-name"
                          value={overtimeFormData.name}
                          onChange={(e) => setOvertimeFormData({ ...overtimeFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="overtime-type">Type</Label>
                        <Select
                          value={overtimeFormData.type}
                          onValueChange={(value) => setOvertimeFormData({ ...overtimeFormData, type: value as OvertimeRuleType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OvertimeRuleType.WEEKDAY}>Weekday</SelectItem>
                            <SelectItem value={OvertimeRuleType.WEEKEND}>Weekend</SelectItem>
                            <SelectItem value={OvertimeRuleType.HOLIDAY}>Holiday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="multiplier">Pay Multiplier</Label>
                        <Input
                          id="multiplier"
                          type="number"
                          step="0.1"
                          min="1"
                          value={overtimeFormData.multiplier}
                          onChange={(e) => setOvertimeFormData({ ...overtimeFormData, multiplier: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="minimumMinutes">Minimum Minutes</Label>
                        <Input
                          id="minimumMinutes"
                          type="number"
                          min="0"
                          value={overtimeFormData.minimumMinutes}
                          onChange={(e) => setOvertimeFormData({ ...overtimeFormData, minimumMinutes: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="requiresApproval"
                          checked={overtimeFormData.requiresApproval}
                          onChange={(e) => setOvertimeFormData({ ...overtimeFormData, requiresApproval: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="requiresApproval">Requires Approval</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseOvertimeDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingOvertimeRule ? "Update" : "Create"} Rule
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : overtimeRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No overtime rules defined
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead>Min. Minutes</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimeRules.map((rule) => (
                    <TableRow key={rule._id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell>{rule.multiplier}x</TableCell>
                      <TableCell>{rule.minimumMinutes} min</TableCell>
                      <TableCell>
                        {rule.requiresApproval ? (
                          <Badge variant="warning">Required</Badge>
                        ) : (
                          <Badge variant="secondary">Not Required</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditOvertimeRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOvertimeRule(rule._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Lateness Rules Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Lateness Rules
                </CardTitle>
                <CardDescription>
                  Configure grace periods and penalties for late arrivals
                </CardDescription>
              </div>
              <Dialog open={latenessDialogOpen} onOpenChange={setLatenessDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingLatenessRule(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <form onSubmit={handleLatenessSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingLatenessRule ? "Edit Lateness Rule" : "Create Lateness Rule"}
                      </DialogTitle>
                      <DialogDescription>
                        Define grace periods and penalty thresholds
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="lateness-name">Rule Name</Label>
                        <Input
                          id="lateness-name"
                          value={latenessFormData.name}
                          onChange={(e) => setLatenessFormData({ ...latenessFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="gracePeriod">Grace Period (minutes)</Label>
                        <Input
                          id="gracePeriod"
                          type="number"
                          min="0"
                          value={latenessFormData.gracePeriodMinutes}
                          onChange={(e) => setLatenessFormData({ ...latenessFormData, gracePeriodMinutes: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label>Penalty Thresholds</Label>
                          <Button type="button" size="sm" variant="outline" onClick={addThreshold}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        {latenessFormData.thresholds.map((threshold, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label className="text-xs">Minutes</Label>
                              <Input
                                type="number"
                                min="0"
                                value={threshold.minutes}
                                onChange={(e) => updateThreshold(index, "minutes", parseInt(e.target.value))}
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Penalty</Label>
                              <Input
                                value={threshold.penalty}
                                onChange={(e) => updateThreshold(index, "penalty", e.target.value)}
                                placeholder="e.g., Warning"
                                required
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeThreshold(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseLatenessDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingLatenessRule ? "Update" : "Create"} Rule
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : latenessRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No lateness rules defined
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grace Period</TableHead>
                    <TableHead>Thresholds</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latenessRules.map((rule) => (
                    <TableRow key={rule._id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.gracePeriodMinutes} min</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {rule.thresholds.map((t, idx) => (
                            <div key={idx} className="text-sm">
                              {t.minutes} min → {t.penalty}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditLatenessRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLatenessRule(rule._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
