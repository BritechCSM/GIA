import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ConnectionsView } from './ConnectionsView';
import { User, Shield, Bell, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function SettingsView() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
                    Ajustes
                </h2>
                <p className="text-slate-500 font-medium">
                    Configura tu entorno de análisis y gestiona tus parámetros generales.
                </p>
            </div>

            <Tabs defaultValue="connections" className="space-y-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-200">
                    <TabsTrigger value="connections" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                        <Database className="w-4 h-4" />
                        Conexiones de Datos
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                        <User className="w-4 h-4" />
                        Perfil y Cuenta
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                        <Shield className="w-4 h-4" />
                        Seguridad y API
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                        <Bell className="w-4 h-4" />
                        Notificaciones
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="connections" className="mt-0 border-0 p-0 outline-none">
                    <ConnectionsView />
                </TabsContent>

                <TabsContent value="profile" className="mt-0">
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle style={{ fontFamily: 'Satoshi' }}>Información del Perfil</CardTitle>
                            <CardDescription>Gestiona tu información pública y personal.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-40 flex items-center justify-center text-slate-400 font-medium italic">
                            Sección en desarrollo...
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle style={{ fontFamily: 'Satoshi' }}>Seguridad</CardTitle>
                            <CardDescription>Configura tus llaves de API y niveles de acceso.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-40 flex items-center justify-center text-slate-400 font-medium italic">
                            Sección en desarrollo...
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle style={{ fontFamily: 'Satoshi' }}>Notificaciones</CardTitle>
                            <CardDescription>Elige qué alertas quieres recibir de Gia.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-40 flex items-center justify-center text-slate-400 font-medium italic">
                            Sección en desarrollo...
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
