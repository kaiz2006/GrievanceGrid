import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Search,
  Loader2,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Department {
  id: string;
  name: string;
  officer_count: number;
  active_cases: number;
  specialization: string[];
}

interface DepartmentAssignmentProps {
  grievanceId: string;
  currentDepartment?: string;
  onAssign?: (departmentId: string) => void;
}

const departments: Department[] = [
  {
    id: "dept_pwd",
    name: "Public Works Department",
    officer_count: 45,
    active_cases: 128,
    specialization: ["ROADS", "INFRASTRUCTURE", "BRIDGES"]
  },
  {
    id: "dept_water",
    name: "Water Supply Department",
    officer_count: 32,
    active_cases: 87,
    specialization: ["WATER_SUPPLY", "PIPELINE", "DRAINAGE"]
  },
  {
    id: "dept_electricity",
    name: "Electricity Board",
    officer_count: 28,
    active_cases: 64,
    specialization: ["ELECTRICITY", "TRANSFORMER", "STREET_LIGHTS"]
  },
  {
    id: "dept_sanitation",
    name: "Sanitation Department",
    officer_count: 52,
    active_cases: 156,
    specialization: ["SANITATION", "GARBAGE", "WASTE_MANAGEMENT"]
  },
  {
    id: "dept_transport",
    name: "Transport Department",
    officer_count: 24,
    active_cases: 42,
    specialization: ["PUBLIC_TRANSPORT", "TRAFFIC", "PARKING"]
  }
];

const DepartmentAssignment: React.FC<DepartmentAssignmentProps> = ({
  grievanceId,
  currentDepartment,
  onAssign
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAssign = async () => {
    if (!selectedDept) return;
    
    setIsAssigning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAssigned(true);
    setIsAssigning(false);
    setIsOpen(false);
    onAssign?.(selectedDept);
  };

  const getWorkloadColor = (activeCases: number) => {
    if (activeCases > 100) return "text-red-500";
    if (activeCases > 50) return "text-amber-500";
    return "text-green-500";
  };

  if (assigned) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-bold text-green-500">Department Assigned</p>
            <p className="text-xs text-muted-foreground">
              {departments.find(d => d.id === selectedDept)?.name}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 justify-between"
      >
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm">
            {currentDepartment || "Assign Department"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 p-4 rounded-2xl bg-card border border-white/10 shadow-xl"
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Department List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedDept === dept.id
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-sm">{dept.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${getWorkloadColor(dept.active_cases)}`}>
                      {dept.active_cases} active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {dept.officer_count} officers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dept.specialization.map((spec) => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="text-[10px] px-2 py-0.5"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedDept || isAssigning}
                className="flex-1 bg-blue-600 hover:bg-blue-500"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Assign
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentAssignment;
