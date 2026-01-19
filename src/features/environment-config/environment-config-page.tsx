"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription } from "@/components/enterprise-ui";
import { NotebookEnvConfig } from "./notebook-env-config";
import { EnvIsolationConfig } from "./env-isolation-config";
import { ResourceMountConfig } from "./resource-mount-config";
import { BookOpen, Box, Cpu } from "lucide-react";

export function EnvironmentConfigPage() {
  const [activeTab, setActiveTab] = useState("notebook");

  return (
    <div className="space-y-6">

      {/* 功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notebook" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Notebook 开发环境
          </TabsTrigger>
          <TabsTrigger value="isolation" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            环境隔离管理
          </TabsTrigger>
          <TabsTrigger value="resource" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            资源动态挂载
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notebook" className="mt-6">
          <NotebookEnvConfig />
        </TabsContent>

        <TabsContent value="isolation" className="mt-6">
          <EnvIsolationConfig />
        </TabsContent>

        <TabsContent value="resource" className="mt-6">
          <ResourceMountConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
