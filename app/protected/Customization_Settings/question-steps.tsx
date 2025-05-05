"use client";
import { useState } from "react";

const questions = [
  {
    question: "관심 있는 문화행사 종류는 무엇인가요?",
    options: ["공연", "전시", "캠핑", "교육/체험", "영화", "스포츠", "축제"],
    multiple: true,
  },
  {
    question: "평소 몇 명이서 가시나요?",
    options: ["1인", "2인", "3인", "4인", "5인"],
  },
  {
    question: "주로 활동하는 여가 시간은?",
    type: "time",
  },
  {
    question: "문화 생활에 사용할 수 있는 금액은?",
    options: ["1만원↓", "1~3만원", "3~5만원", "5~10만원", "10만원↑"],
  },
];

export default function QuestionSteps() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});

  const current = questions[step];

  const handleSingleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [step]: answer }));
    goNext();
  };

  const handleMultipleAnswer = (answer: string) => {
    const prev = Array.isArray(answers[step]) ? answers[step] as string[] : [];
    const updated = prev.includes(answer)
      ? prev.filter((a) => a !== answer)
      : [...prev, answer];
    setAnswers((prevAnswers) => ({ ...prevAnswers, [step]: updated }));
  };

  const goNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      console.log("최종 답변:", answers);
      // 이후 처리 (ex: 서버 전송, 라우팅 등)
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleTimeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      if (Number(value) >= 0 && Number(value) <= 24) {
        setAnswers((prev) => ({ ...prev, [step]: `${value}시` }));
        goNext();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 px-6">
      <div className="text-gray-600 text-lg">
        ({step + 1} / {questions.length})
      </div>
      <h2 className="text-xl font-semibold text-center">{current.question}</h2>

      {/* 옵션이 있는 경우 */}
      {current.options && (
        <div className="grid grid-cols-3 gap-4">
          {current.options.map((opt, idx) => {
            const isSelected = Array.isArray(answers[step])
              ? answers[step]?.includes(opt)
              : answers[step] === opt;

            return (
              <button
                key={idx}
                onClick={() =>
                  current.multiple
                    ? handleMultipleAnswer(opt)
                    : handleSingleAnswer(opt)
                }
                className={`px-4 py-2 border rounded-md ${
                  isSelected ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* 시간 입력 */}
      {current.type === "time" && (
        <div className="flex flex-col items-center gap-3">
          <input
            type="number"
            min="0"
            max="24"
            placeholder="예: 18"
            onKeyDown={handleTimeInput}
            className="border px-4 py-2 rounded-md text-center w-24"
          />
          <span className="text-sm text-gray-500">
            숫자 입력 후 Enter를 눌러주세요
          </span>
        </div>
      )}

      {/* 다음 버튼 (다중 선택 시 표시) */}
      {current.multiple && (
        <button
          onClick={goNext}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다음
        </button>
      )}

      {/* 뒤로 가기 버튼 */}
      {step > 0 && (
        <button
          onClick={goBack}
          className="mt-4 text-sm text-blue-500 underline"
        >
          ← 이전으로
        </button>
      )}
    </div>
  );
}
