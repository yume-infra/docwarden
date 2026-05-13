# llm-wiki-pick

可以理解为是走了一个 pick 语义的流程，现在这里定义 [[理念-v1]] 与 [[llm-wiki]] 的关系

## 采纳的部分

### 文档需要 lint

结构化的 lint 可以用脚本指定，语义上的 lint 是当前难点中的难点。尝试的方案是 断言 和短动词，还需要更明确指定

### index

index.md 是内容导航和工作面入口，log.md 是时间线。

本项目的 AI 文档基建是维护一个持续演化的文档工作面。在 docwarden 之前，先用拙劣的工作流把具体理念带起来，后续在迭代中优化。

agent 进入项目后，必须先通过 index 入口理解当前文档主线，再根据目录约束参与 working、候选提炼、review 辅助或 docs 更新。

### schema

schema 是核心。定义目录结构、维护约定和操作流程

## 关键差异

docwarden 项目的 docs/ 是人类维护的确定层级，llm 只会参与维护 .docwarden 下的文件，且这里的基础内容也由人类搭起
