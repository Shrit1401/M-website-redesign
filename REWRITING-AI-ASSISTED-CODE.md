# Rewriting AI-Assisted Code So It's Actually Yours

If an AI assistant wrote a lot of your code, renaming variables and rewording comments won't change much. The code still reads as written by someone else because it *was*. The real goal is code you understand, that follows your conventions, and that you could explain or change without help. Once that's true, the code is yours, and it reads that way.

> **A note on honesty:** this guide is about owning and improving code, not about hiding where it came from. If your school, employer, client or a contest requires you to disclose AI use, disclose it. Rewriting code doesn't change those rules.

---

## 1. What "AI-looking" code usually means

Reviewers and practitioner checklists keep flagging the same patterns. These come from blogs and tool documentation, not controlled studies, but they match what you see in real reviews.

| Pattern | What it looks like |
|---|---|
| **Comments that narrate** | `// Increment the counter` above `count++`. Comments say *what* instead of *why*. |
| **Hollow claims** | "Optimized", "robust", "production-ready" in comments with no numbers or reasons behind them. |
| **Over-abstraction** | Wrapper classes that forward to one method, interfaces with one implementation, layers that pass calls through unchanged. |
| **Generic names** | `data`, `result`, `processUserData`, `handleItem`, `utils2`. |
| **Defensive code that doesn't fit** | try/catch and null checks everywhere, even where the rest of the codebase doesn't do that. |
| **Pattern drift** | The same problem solved three different ways in three files, because each prompt started fresh. |
| **Duplication** | Copy-pasted blocks instead of reusing an existing helper. |
| **Hollow tests** | Tests that only check that mocks were called, not that the behavior is correct. |

The data backs up the duplication point. GitClear's analyses of hundreds of millions of changed lines found that duplicated code blocks and short-term churn went up, and refactoring went down, as AI assistants spread. The reports show correlation, not proof that AI caused it, but they explain why AI-heavy codebases feel repetitive.

---

## 2. The process, one function at a time

### Step 1: Lock in current behavior first
Before you touch anything, write or run tests that capture what the code does now, including edge cases: empty input, missing fields, errors, permissions. Those tests should pass before and after the rewrite. Be especially careful with **validation, async code, error handling and auth checks**. Those are the parts that look unnecessary until they break.

### Step 2: Describe it in plain English
Write one sentence about what the function should do:

> "Take the list of orders, keep the paid ones, and add up their totals."

Then rewrite from that sentence, not from the AI's version. Go back to the original afterwards to catch details you missed. This way every line you keep has a reason.

### Step 3: Match *your* style
If you have code you wrote yourself, use it as the reference. Look at:
- how you name variables and functions
- how you split work into functions
- how you handle errors
- how much you comment

Apply those conventions throughout the file. Consistency with the rest of the codebase does more than any single clever change.

### Step 4: Remove complexity that has no job
Before:

```js
function processUserData(userDataArray) {
  const filteredUserData = userDataArray.filter((userData) => {
    return userData.isActive === true;
  });

  const transformedUserData = filteredUserData.map((userData) => {
    return userData.email;
  });

  return transformedUserData;
}
```

After:

```js
function getActiveUserEmails(users) {
  return users
    .filter(user => user.isActive === true)
    .map(user => user.email);
}
```

The gain comes from the specific name and the direct logic. Note that `=== true` stays: changing it to a truthiness check would change behavior if `isActive` can be `"yes"` or `1`.

Look for:
- variables used once right after being assigned
- wrappers that only forward calls
- abstractions built for a "future" that never came
- logic that duplicates a helper you already have

### Step 5: Rewrite comments to explain decisions
Delete:

```js
// Increment the retry counter
retries++;
```

Keep (or add):

```js
// Retry once: the device often drops its first response after waking.
```

Good comments explain business rules, odd behavior, workarounds and tradeoffs. If a comment just repeats the next line, remove it.

### Step 6: Verify, then move on
Run the tests after each small change. Don't rewrite a whole file in one go. If you start to feel unsure, stop and check before going further.

---

## 3. A prompt you can reuse

If you use an AI to help with the refactor, give it constraints:

```
Help me refactor this code into a clear, consistent style.

Use my reference code to learn my naming, structure,
and commenting conventions.

Preserve existing behavior, public interfaces, validation,
and error handling.

Simplify unnecessary abstractions, remove duplicated logic,
and replace vague names with names that describe their purpose.
Keep useful comments and remove ones that only restate code.

Do not add dependencies or change the architecture.

Work on one function at a time. Explain each meaningful change
and flag anything whose intended behavior is unclear.

My reference code:
[paste code you wrote]

Code to refactor:
[paste the AI-assisted code]
```

Ask it to explain *why* it made each change, so you can review the diff against its stated reasons instead of accepting it blindly.

---

## 4. Checklist before you call it done

- [ ] I can explain why every line exists.
- [ ] I could change this function without asking an AI.
- [ ] Names describe purpose, not type (`activeEmails`, not `dataArray`).
- [ ] No comment just restates the code below it.
- [ ] No wrapper or interface exists without a reason.
- [ ] Error handling matches the rest of the codebase.
- [ ] Duplicated logic has been merged into one helper.
- [ ] Tests check real behavior, not just mocks.
- [ ] All tests pass, and behavior matches the original.

---

## 5. About "AI detectors"

Don't use detectors as your goal. Research on AI-generated code detection (e.g. the arXiv study *"An Empirical Study on Automatically Detecting AI-Generated Source Code: How Far Are We?"* and a University of Warwick project with about 5,000 code samples) found that current detectors do poorly on code, with many false positives and false negatives. Most were built for prose, and code doesn't follow prose statistics.

So "passing a detector" proves nothing either way. The test that matters is the one in the checklist: **can you explain it and change it yourself?**

---

## Sources

- GitClear AI code quality coverage: [arc.dev summary (153M lines)](https://arc.dev/developer-blog/impact-of-ai-on-code/), [Rob Bowley on the 2025 report](https://blog.robbowley.net/2025/02/17/gitclears-latest-report-indicates-genai-is-having-a-negative-impact-on-code-quality/), [Analytics Vidhya](https://www.analyticsvidhya.com/blog/2024/01/ai-coding-assistants-produce-bad-quality-code-study/)
- AI code patterns / review: [AI slop in code, Managed Code](https://www.managed-code.com/blog-post/ai-slop-in-code), [LLM artifacts detection checklist](https://playbooks.com/skills/existential-birds/beagle/llm-artifacts-detection), [AI code review, DEV](https://dev.to/rakbro/ai-code-review-what-to-look-for-in-the-age-of-copilots-2g02)
- Safe refactoring: [Where AI helps in refactoring and where it makes things worse](https://albrightlabs.com/blog/where-ai-helps-in-refactoring-and-where-it-makes-things-worse), [Keeping AI refactoring from breaking trusted behaviour](https://nhimg.org/faq/how-do-engineers-keep-ai-assisted-refactoring-from-breaking-trusted-behaviour/), [arXiv 2604.03135, test-first AI refactoring case study](https://arxiv.org/abs/2604.03135), [Let AI write your code, but not your tests](https://learnagilepractices.substack.com/p/let-ai-write-your-code-but-not-your)
- Detectors: [arXiv 2411.04299](https://arxiv.org/html/2411.04299v1), [Warwick: assessing AI detectors on code](https://warwick.ac.uk/fac/cross_fac/eduport/edufund/projects/yang/projects/assessing-ai-detectors-in-identifying-ai-generated-code-implications-for-education/)
