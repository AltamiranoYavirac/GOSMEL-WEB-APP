"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";

import { QUICK_ACTIONS } from "../model/topbar-constants";

export default function QuickActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Acciones rápidas">
          <Icon icon="ph:plus" width={20} height={20} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {QUICK_ACTIONS.map((action) => (
          <DropdownMenuItem key={action.href} asChild>
            <Link href={action.href}>
              <Icon icon={action.icon} width={16} height={16} aria-hidden="true" />
              {action.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
