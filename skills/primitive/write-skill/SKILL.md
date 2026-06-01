---
name: write-skill
description: 
---

# Write Skill

创建 Codex 原生 skill，并沿用官方 skill 结构和校验路径。本 skill 只处理 skill 创作本身，不定义更上层的 workflow、capability package 或分发 namespace。

## 范围

创建或更新这种目录结构：

```text
skill-name/
  SKILL.md
  agents/openai.yaml
  scripts/
  references/
  assets/
```

只有 `SKILL.md` 是必需文件。只有当 skill 确实有可复用材料时，才创建 `scripts/`、`references/` 或 `assets/`。

不要在 skill 内创建 README、安装指南、changelog、过程记录或额外说明文档。

## 创作输入

写入前先确认最小必要信息：

- 这个 skill 处理的任务或领域。
- 哪些具体用户请求应该触发它。
- 目标 skill 名称和输出位置。
- 重复使用时需要的可复用资源。
- 能证明 skill 可用的校验或 forward-test 示例。

如果这些信息已经能从对话或源材料中确定，就直接推进。

## 脚手架

创建新 skill 时，使用内置初始化脚本：

```bash
python3 scripts/init_skill.py <skill-name> --path <output-directory> [--resources scripts,references,assets]
```

只有当占位示例有助于 review 资源结构时，才使用 `--examples`。其他情况下避免生成占位文件。

初始化脚本会创建 skill 目录、`SKILL.md`、`agents/openai.yaml` 和指定的资源目录。生成后，必须替换所有 TODO，才能把该 skill 视为可用。

## 编写 SKILL.md

为未来另一个不共享当前对话上下文的 Codex 实例编写。

- 所有触发条件都写进 frontmatter 的 `description`。
- 除非更新已有 skill 且已有官方支持字段，否则 frontmatter 只保留官方支持字段。
- 正文保持流程化、具体。
- 优先使用简洁示例，而不是解释性段落。
- 每个 reference 文件都要从 `SKILL.md` 链接，并说明什么时候读取。
- reference 文件只保持一层深度。
- 当主文件会变臃肿时，把细节移到 `references/`。
- 只有在操作确定性强、易出错或会反复生成时，才添加 scripts。
- 只有当最终输出需要文件、模板、图片、字体或 boilerplate 时，才添加 assets。

## UI Metadata

使用下面的脚本生成或更新 `agents/openai.yaml`：

```bash
python3 scripts/generate_openai_yaml.py <path/to/skill-folder> --interface key=value
```

添加可选 UI 字段前，先读取 `references/openai_yaml.md`。不要发明不受支持的 metadata。

## 校验

完成后必须校验 skill：

```bash
python3 scripts/quick_validate.py <path/to/skill-folder>
```

如果 skill 包含 scripts，需要运行每个脚本，或在脚本数量较多时运行有代表性的样本。

复杂 skill 需要用干净任务 prompt 做 forward-test：

```text
Use $<skill-name> at <path/to/skill-folder> to handle: <realistic user request>
```

传入原始材料和接近真实用户请求的任务。不要传入预期答案、已怀疑的问题或前置结论。

## 更新已有 skill

修改已有 skill 时：

- 先读取已有 `SKILL.md` 和 bundled resources。
- 保留有用的本地结构和约定。
- 移除过期 TODO、占位内容和未使用的资源文件。
- 只有 metadata 过期时，才重新生成 `agents/openai.yaml`。
- 修改后重新运行校验。
- 不触碰无关 skill。
