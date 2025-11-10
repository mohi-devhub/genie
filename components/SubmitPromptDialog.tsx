"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession, signIn } from "next-auth/react";
import { trpc } from "~/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Zod validation schema
const promptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  promptText: z.string().min(1, "Prompt text is required").max(5000, "Prompt text must be 5000 characters or less"),
  categoryId: z.string().min(1, "Category is required"),
  modelId: z.string().min(1, "Model is required"),
});

type PromptFormData = z.infer<typeof promptSchema>;

export function SubmitPromptDialog() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  // Handle dialog open - redirect to sign in if not authenticated
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !session) {
      signIn("google", { callbackUrl: "/prompts" });
      return;
    }
    setOpen(newOpen);
  };

  // Fetch categories and models
  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: models } = trpc.model.getAll.useQuery();

  // Set up form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: "",
      promptText: "",
      categoryId: "",
      modelId: "",
    },
  });

  // Watch select values for controlled components
  const categoryId = watch("categoryId");
  const modelId = watch("modelId");

  // Create prompt mutation
  const createPrompt = trpc.prompt.create.useMutation({
    onSuccess: () => {
      // Invalidate prompt queries to refresh the list
      utils.prompt.getAll.invalidate();
      // Close dialog and reset form
      setOpen(false);
      reset();
    },
  });

  const onSubmit = (data: PromptFormData) => {
    createPrompt.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Submit Prompt</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit a New Prompt</DialogTitle>
          <DialogDescription>
            Share your AI prompt with the community. Fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Prompt Text Field */}
          <div className="space-y-2">
            <Label htmlFor="promptText">Prompt Text</Label>
            <Textarea
              id="promptText"
              placeholder="Enter your prompt here..."
              rows={6}
              {...register("promptText")}
            />
            {errors.promptText && (
              <p className="text-sm text-destructive">{errors.promptText.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Model Field */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={modelId}
              onValueChange={(value) => setValue("modelId", value, { shouldValidate: true })}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.modelId && (
              <p className="text-sm text-destructive">{errors.modelId.message}</p>
            )}
          </div>

          {/* Error Message */}
          {createPrompt.error && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                Error: {createPrompt.error.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPrompt.isPending}>
              {createPrompt.isPending ? "Submitting..." : "Submit Prompt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
