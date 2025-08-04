import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RuleItem {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  status: "active" | "inactive";
  lastUpdated: string;
}

const Rules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<RuleItem[]>([
    {
      id: "1",
      name: "High Variance Alert",
      description: "Alert when position variance exceeds 5%",
      condition: "position_variance > 0.05",
      action: "flag_exception",
      status: "active",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      name: "Missing External Position",
      description: "Flag when internal position exists but external does not",
      condition: "internal_position > 0 AND external_position = 0",
      action: "create_exception",
      status: "active",
      lastUpdated: "2024-01-14"
    },
    {
      id: "3",
      name: "Legacy Fund Check",
      description: "Check for positions in deprecated funds",
      condition: "fund_status = 'deprecated'",
      action: "review_required",
      status: "inactive",
      lastUpdated: "2024-01-10"
    }
  ]);

  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: DataTableColumn[] = [
    { key: "name", header: "Rule Name" },
    { key: "description", header: "Description" },
    { key: "condition", header: "Condition" },
    { key: "action", header: "Action" },
    { key: "status", header: "Status" },
    { key: "lastUpdated", header: "Last Updated" },
    { key: "actions", header: "Actions" }
  ];

  const tableData: DataTableRow[] = rules.map(rule => ({
    id: rule.id,
    data: {
      name: rule.name,
      description: rule.description,
      condition: (
        <code className="bg-muted px-2 py-1 rounded text-sm">
          {rule.condition}
        </code>
      ),
      action: (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
          {rule.action}
        </span>
      ),
      status: (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          rule.status === 'active' 
            ? 'bg-success/10 text-success' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {rule.status}
        </span>
      ),
      lastUpdated: rule.lastUpdated,
      actions: (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(rule);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  }));

  const handleEdit = (rule: RuleItem) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: Partial<RuleItem>) => {
    if (editingRule) {
      // Update existing rule
      setRules(prev => prev.map(r => 
        r.id === editingRule.id 
          ? { ...r, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : r
      ));
      toast({
        title: "Rule Updated",
        description: "The rule has been successfully updated.",
      });
    } else {
      // Add new rule
      const newRule: RuleItem = {
        id: Date.now().toString(),
        name: formData.name || "",
        description: formData.description || "",
        condition: formData.condition || "",
        action: formData.action || "",
        status: "active",
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setRules(prev => [...prev, newRule]);
      toast({
        title: "Rule Added",
        description: "The new rule has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rules Management</h1>
          <p className="text-muted-foreground">
            Configure business rules for exception detection and validation
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Rule" : "Add New Rule"}
              </DialogTitle>
            </DialogHeader>
            <RuleForm 
              rule={editingRule} 
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Search rules..."
      />
    </div>
  );
};

interface RuleFormProps {
  rule: RuleItem | null;
  onSave: (data: Partial<RuleItem>) => void;
  onCancel: () => void;
}

const RuleForm = ({ rule, onSave, onCancel }: RuleFormProps) => {
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    condition: rule?.condition || "",
    action: rule?.action || "",
    status: rule?.status || "active" as "active" | "inactive"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter rule name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what this rule does"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Textarea
          id="condition"
          value={formData.condition}
          onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
          placeholder="Enter the condition logic (e.g., position_variance > 0.05)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Select value={formData.action} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, action: value }))
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flag_exception">Flag Exception</SelectItem>
            <SelectItem value="create_exception">Create Exception</SelectItem>
            <SelectItem value="review_required">Review Required</SelectItem>
            <SelectItem value="auto_resolve">Auto Resolve</SelectItem>
            <SelectItem value="send_alert">Send Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {rule && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: "active" | "inactive") => 
            setFormData(prev => ({ ...prev, status: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {rule ? "Update" : "Create"} Rule
        </Button>
      </div>
    </form>
  );
};

export default Rules;