import { useParams } from "@tanstack/react-router";
import React from "react";

export default function Projects() {
  const { projectId } = useParams();

  return (
    <div>
      <p className="text-3xl font-bold">
        Project name: {"  "}
        <span className="underline">{projectId}</span>
      </p>
    </div>
  );
}
