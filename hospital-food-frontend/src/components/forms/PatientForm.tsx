import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function PatientForm({ onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'MALE',
    roomNumber: '',
    bedNumber: '',
    floorNumber: '',
    diseases: '',
    allergies: '',
    contactNumber: '',
    emergencyContact: '',
  });

  const createPatient = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          age: parseInt(data.age),
          diseases: data.diseases.split(',').map(d => d.trim()),
          allergies: data.allergies.split(',').map(a => a.trim()),
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPatient.mutate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Patient Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
            <Input
              placeholder="Bed Number"
              value={formData.bedNumber}
              onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
            />
            <Input
              placeholder="Floor Number"
              value={formData.floorNumber}
              onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
            />
          </div>
          <Input
            placeholder="Diseases (comma-separated)"
            value={formData.diseases}
            onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
          />
          <Input
            placeholder="Allergies (comma-separated)"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
          />
          <Input
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
          <Input
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Add Patient
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
