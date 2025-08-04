import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MappingItem {
  id: string;
  externalName: string;
  internalName: string;
  type: "secnum" | "fund";
  status: "active" | "inactive";
  lastUpdated: string;
}

const Mapping = () => {
  const { toast } = useToast();
  const [mappings, setMappings] = useState<MappingItem[]>([
    {
      id: "1",
      externalName: "Fund C1",
      internalName: "Fund C13",
      type: "fund",
      status: "active",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2", 
      externalName: "SEC12345",
      internalName: "SECNUM_12345_A",
      type: "secnum",
      status: "active",
      lastUpdated: "2024-01-14"
    },
    {
      id: "3",
      externalName: "Fund B7",
      internalName: "Fund B07",
      type: "fund", 
      status: "inactive",
      lastUpdated: "2024-01-10"
    }
  ]);

  const [editingMapping, setEditingMapping] = useState<MappingItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: DataTableColumn[] = [
    { key: "externalName", header: "External Name" },
    { key: "internalName", header: "Internal Name" },
    { key: "type", header: "Type" },
    { key: "status", header: "Status" },
    { key: "lastUpdated", header: "Last Updated" },
    { key: "actions", header: "Actions" }
  ];

  const tableData: DataTableRow[] = mappings.map(mapping => ({
    id: mapping.id,
    data: {
      externalName: mapping.externalName,
      internalName: mapping.internalName,
      type: mapping.type.toUpperCase(),
      status: (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          mapping.status === 'active' 
            ? 'bg-success/10 text-success' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {mapping.status}
        </span>
      ),
      lastUpdated: mapping.lastUpdated,
      actions: (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(mapping);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  }));

  const handleEdit = (mapping: MappingItem) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: Partial<MappingItem>) => {
    if (editingMapping) {
      // Update existing mapping
      setMappings(prev => prev.map(m => 
        m.id === editingMapping.id 
          ? { ...m, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : m
      ));
      toast({
        title: "Mapping Updated",
        description: "The mapping has been successfully updated.",
      });
    } else {
      // Add new mapping
      const newMapping: MappingItem = {
        id: Date.now().toString(),
        externalName: formData.externalName || "",
        internalName: formData.internalName || "",
        type: formData.type as "secnum" | "fund" || "fund",
        status: "active",
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setMappings(prev => [...prev, newMapping]);
      toast({
        title: "Mapping Added",
        description: "The new mapping has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingMapping(null);
  };

  const handleAddNew = () => {
    setEditingMapping(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mapping Management</h1>
          <p className="text-muted-foreground">
            Manage mappings between external and internal fund and security identifiers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Mapping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMapping ? "Edit Mapping" : "Add New Mapping"}
              </DialogTitle>
            </DialogHeader>
            <MappingForm 
              mapping={editingMapping} 
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Search mappings..."
      />
    </div>
  );
};

interface MappingFormProps {
  mapping: MappingItem | null;
  onSave: (data: Partial<MappingItem>) => void;
  onCancel: () => void;
}

const MappingForm = ({ mapping, onSave, onCancel }: MappingFormProps) => {
  const [formData, setFormData] = useState({
    externalName: mapping?.externalName || "",
    internalName: mapping?.internalName || "",
    type: mapping?.type || "fund" as "secnum" | "fund",
    status: mapping?.status || "active" as "active" | "inactive"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="externalName">External Name</Label>
        <Input
          id="externalName"
          value={formData.externalName}
          onChange={(e) => setFormData(prev => ({ ...prev, externalName: e.target.value }))}
          placeholder="Enter external identifier"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="internalName">Internal Name</Label>
        <Input
          id="internalName"
          value={formData.internalName}
          onChange={(e) => setFormData(prev => ({ ...prev, internalName: e.target.value }))}
          placeholder="Enter internal identifier"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value: "secnum" | "fund") => 
          setFormData(prev => ({ ...prev, type: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fund">Fund</SelectItem>
            <SelectItem value="secnum">Security Number</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mapping && (
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
          {mapping ? "Update" : "Create"} Mapping
        </Button>
      </div>
    </form>
  );
};

export default Mapping;