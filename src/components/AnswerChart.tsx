"use client";
import React, { useState } from "react";
import { Question } from "../types";

const colors = [
  "bg-red-500", // Red
  "bg-orange-500", // Orange
  "bg-yellow-500", // Yellow
  "bg-green-500", // Green
  "bg-teal-500", // Teal
  "bg-blue-500", // Blue
  "bg-indigo-500", // Indigo
  "bg-purple-500", // Purple
  "bg-pink-500", // Pink
  "bg-rose-500", // Rose
  "bg-cyan-500", // Cyan
  "bg-lime-500", // Lime
  "bg-amber-500", // Amber
  "bg-violet-500", // Violet
  "bg-fuchsia-500", // Fuchsia
  "bg-sky-500", // Sky
  "bg-green-600", // Dark Green
  "bg-blue-600", // Dark Blue
  "bg-purple-600", // Dark Purple
  "bg-pink-600", // Dark Pink
];

const barSize = [
  "w-[0%]",
  "w-[1%]",
  "w-[2%]",
  "w-[3%]",
  "w-[4%]",
  "w-[5%]",
  "w-[6%]",
  "w-[7%]",
  "w-[8%]",
  "w-[9%]",
  "w-[10%]",
  "w-[11%]",
  "w-[12%]",
  "w-[13%]",
  "w-[14%]",
  "w-[15%]",
  "w-[16%]",
  "w-[17%]",
  "w-[18%]",
  "w-[19%]",
  "w-[20%]",
  "w-[21%]",
  "w-[22%]",
  "w-[23%]",
  "w-[24%]",
  "w-[25%]",
  "w-[26%]",
  "w-[27%]",
  "w-[28%]",
  "w-[29%]",
  "w-[30%]",
  "w-[31%]",
  "w-[32%]",
  "w-[33%]",
  "w-[34%]",
  "w-[35%]",
  "w-[36%]",
  "w-[37%]",
  "w-[38%]",
  "w-[39%]",
  "w-[40%]",
  "w-[41%]",
  "w-[42%]",
  "w-[43%]",
  "w-[44%]",
  "w-[45%]",
  "w-[46%]",
  "w-[47%]",
  "w-[48%]",
  "w-[49%]",
  "w-[50%]",
  "w-[51%]",
  "w-[52%]",
  "w-[53%]",
  "w-[54%]",
  "w-[55%]",
  "w-[56%]",
  "w-[57%]",
  "w-[58%]",
  "w-[59%]",
  "w-[60%]",
  "w-[61%]",
  "w-[62%]",
  "w-[63%]",
  "w-[64%]",
  "w-[65%]",
  "w-[66%]",
  "w-[67%]",
  "w-[68%]",
  "w-[69%]",
  "w-[70%]",
  "w-[71%]",
  "w-[72%]",
  "w-[73%]",
  "w-[74%]",
  "w-[75%]",
  "w-[76%]",
  "w-[77%]",
  "w-[78%]",
  "w-[79%]",
  "w-[80%]",
  "w-[81%]",
  "w-[82%]",
  "w-[83%]",
  "w-[84%]",
  "w-[85%]",
  "w-[86%]",
  "w-[87%]",
  "w-[88%]",
  "w-[89%]",
  "w-[90%]",
  "w-[91%]",
  "w-[92%]",
  "w-[93%]",
  "w-[94%]",
  "w-[95%]",
  "w-[96%]",
  "w-[97%]",
  "w-[98%]",
  "w-[99%]",
];

export default function AnswerChart({
  questions,
  answers,
  targetNumber,
}: {
  questions: Question[];
  answers: number[][];
  targetNumber: number;
}) {
  const pctg = (answer: number) => {
    return barSize[Math.round((answer / Number(targetNumber)) * 100)];
  };

  return (
    <div className="flex flex-col justify-start h-auto rounded-lg mb-24 px-7 pt-4 pb-7 bg-purple-50 lg:w-3/5 w-80">
      <h3 className="font-extrabold text-2xl">Answers</h3>
      {answers.map((answer: number[], i: number) => (
        <div key={i}>
          <h3 className="font-semibold font-serif mt-2">
            {questions[i].question}
          </h3>
          <div
            className={`flex flex-row ${pctg(answer[i])} ${
              colors[i]
            } h-8 rounded-lg relative`}
          >
            <span className="absolute top-1 left-2">{answer[i]}</span>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
}
