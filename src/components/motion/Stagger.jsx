"use client";
import Reveal from "./Reveal";
export function Stagger({children,className=""}){return <div className={className}>{children}</div>;}
export function StaggerItem({children,className=""}){return <Reveal className={className}>{children}</Reveal>;}
