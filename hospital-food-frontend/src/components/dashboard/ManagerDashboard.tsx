import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { PatientForm } from '../forms/PatientForm';
import { DietChartForm } from '../forms/DietChartForm';
import { DeliveryStatus } from './DeliveryStatus';

export default function ManagerDashboard() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDietChartForm, setShowDietChartForm] = useState(false);

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  const { data: deliveries, isLoading: loadingDeliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: fetchDeliveries
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hospital Food Manager Dashboard</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowPatientForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
          <Button onClick={() => setShowDietChartForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Diet Chart
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{patients?.length || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Today's Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{deliveries?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {deliveries?.filter(d => d.status === 'PENDING').length || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patients List</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={patientColumns}
                data={patients || []}
                loading={loadingPatients}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryStatus deliveries={deliveries || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showPatientForm && (
        <PatientForm
          onClose={() => setShowPatientForm(false)}
          onSubmit={handlePatientSubmit}
        />
      )}

      {showDietChartForm && (
        <DietChartForm
          onClose={() => setShowDietChartForm(false)}
          onSubmit={handleDietChartSubmit}
        />
      )}
    </div>
  );
}