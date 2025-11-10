"use client";

import { useState } from "react";
import { trpc } from "~/lib/trpc/client";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PromptCard } from "~/components/PromptCard";

type SortBy = "NEW" | "TOP";

interface PromptGalleryProps {
  initialPrompts: Array<{
    id: string;
    createdAt: Date;
    title: string;
    promptText: string;
    authorId: string;
    categoryId: string;
    modelId: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    category: {
      id: string;
      name: string;
    };
    model: {
      id: string;
      name: string;
    };
    voteScore: number;
    currentUserVote: "UP" | "DOWN" | null;
  }>;
}

export function PromptGallery({ initialPrompts }: PromptGalleryProps) {
  const [sortBy, setSortBy] = useState<SortBy>("NEW");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Fetch prompts with current filters
  const { data: prompts, isLoading, error } = trpc.prompt.getAll.useQuery({
    sortBy,
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(selectedModel && { modelId: selectedModel }),
  });

  // Fetch categories for filter dropdown
  const { data: categories } = trpc.category.getAll.useQuery();

  // Fetch models for filter dropdown
  const { data: models } = trpc.model.getAll.useQuery();

  return (
    <div id="prompts" className="space-y-6">
      {/* Filters and Sorting Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
          <TabsList>
            <TabsTrigger value="NEW">New</TabsTrigger>
            <TabsTrigger value="TOP">Top</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter Dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Category Filter */}
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model Filter */}
          <Select
            value={selectedModel ?? "all"}
            onValueChange={(value) =>
              setSelectedModel(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">
            Error loading prompts: {error.message}
          </p>
        </div>
      )}

      {/* Prompts Grid */}
      {!isLoading && !error && prompts && (
        <>
          {prompts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No prompts found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
