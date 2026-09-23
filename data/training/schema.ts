/**
 * Future fine-tuning export schema (JSONL).
 * Each line is one training example for Qwen/Llama instruction tuning.
 *
 * Example line:
 * {"instruction":"Create an SSC CGL Quantitative Aptitude MCQ on Profit and Loss.","input":"","output":"{\"stemEn\":\"...\",\"optionA\":\"...\",\"optionB\":\"...\",\"optionC\":\"...\",\"optionD\":\"...\",\"correctOption\":\"B\",\"explanation\":\"...\"}"}
 *
 * Export wrong answers from attempts into data/training/wrong_pairs.jsonl
 * and generated items into data/training/generated.jsonl for later training runs.
 */
export type TrainingExample = {
  instruction: string;
  input: string;
  output: string;
};
