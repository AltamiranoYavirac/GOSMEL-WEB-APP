"use client";

import { Icon } from "@iconify/react";

import { Form, SwitchField, TextField, useAppForm } from "@/shared/form";
import { Button, Card, CardContent, CardHeader, CardTitle, ImageUploadField, Spinner } from "@/shared/ui";

import { useUpdateSiteAsset } from "../hooks/useUpdateSiteAsset";
import {
  mapSiteAssetToFormValues,
  siteAssetFormSchema,
  type ISiteAssetFormValues,
} from "../model/SiteAssetForm.config";
import type { ISiteAssetCardProps } from "./SiteAssetCard.types";

export default function SiteAssetCard({ asset }: ISiteAssetCardProps) {
  const mutation = useUpdateSiteAsset();
  const form = useAppForm<ISiteAssetFormValues>({
    schema: siteAssetFormSchema,
    values: mapSiteAssetToFormValues(asset),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const file = form.watch("file");
  const publicId = form.watch("publicId");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{asset.name}</CardTitle>
        <p className="font-mono text-xs text-muted-foreground">{asset.key}</p>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          id={`site-asset-${asset.key}`}
          className="space-y-4"
          onSubmit={(values: ISiteAssetFormValues) => mutation.mutate({ key: asset.key, values, currentPublicId: asset.publicId })}
        >
          <ImageUploadField
            value={publicId}
            file={file}
            onFileChange={(nextFile) => {
              form.setValue("file", nextFile, { shouldDirty: true });
              if (nextFile) form.setValue("removeImage", false, { shouldDirty: true });
            }}
            onRemove={() => {
              form.setValue("publicId", "", { shouldDirty: true });
              form.setValue("removeImage", true, { shouldDirty: true });
            }}
            disabled={mutation.isPending}
          />
          <TextField name="alt" label="Texto alternativo" />
          <div className="flex items-center justify-between gap-3">
            <SwitchField name="published" label="Publicado" />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:floppy-disk" aria-hidden="true" />}
              Guardar
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
