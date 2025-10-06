"use client";
import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const MobileMenu = () => {
  return (
    <Sheet >
      <SheetTrigger className="md:hidden mr-5"><Menu/></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-semibold text-2xl">Resumate</SheetTitle>
        </SheetHeader>
         <Button className="mt-10 w-full" > <Link href={'/login'}>Login</Link></Button>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
