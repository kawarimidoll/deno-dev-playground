import * as z from "https://deno.land/x/zod@v3.11.6/mod.ts";
// https://zenn.dev/uttk/articles/bd264fa884e026

const schema1 = z.object({
  str: z.string(),
});

// simple validation
try {
  console.log(schema1.parse({ str: "" }));
  console.log(schema1.parse({ str: 0 }));
} catch (err) {
  // error is thrown when validation fails
  console.error(err);
  /*
  [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["str"],
      "message": "Expected string, received number",
    },
  ];
  */
}

const schema2 = z.object({
  str: z.string().max(6),
  num: z.number().optional(),
});

// { result: true; data: string } | { result: false; error: ZodError }
console.log(schema2.safeParse({ str: "hello", num: 8 }));
console.log(schema2.safeParse({ str: "hello zod" }));

// const CommonSchema = z.object({
//   id: z.number().min(1),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   deletedAt: z.date().optional(),
// });
// const UserSchema = CommonSchema.extend({
//   name: z.string(),
//   age: z.number().min(0),
// });
// const TaskSchema = CommonSchema.extend({
//   name: z.string(),
//   done: z.boolean(),
// });
// console.log(Object.keys(UserSchema));
// console.log(Object.keys(TaskSchema));
