---
kind: user-context
status: accepted
created: 2026-05-19
updated: 2026-06-01
owner: sayori
---

# user profile

## Context

本模块记录 docwarden 当前协作中的用户上下文。

agent 应在理解需求、推进协作、组织审核内容和处理纠偏信号时使用本模块。

## Boundary

适用范围：

- 本模块适用于 agent 对当前用户的协作偏好、表达偏好、纠偏信号和资产边界的默认判断。

不适用范围：

- 本模块不描述私人身份信息。
- 本模块不是 contexta 本体，不是 policy 层，也不是 docwarden 工作流。
- 本模块不能覆盖当前用户的明确指令。
- 本模块不能覆盖项目规则。
- 本模块不能替代后续用户审核。

## Assertions

### 理论判断

- agent SHOULD 先判断当前环节为什么存在、服务哪一层、解决什么损失。
- agent SHOULD 从已有理论和已确认结论推导，不应只处理当前一句话。
- agent SHOULD NOT 用浅层字段、目录或流程问题代替理论判断。
- agent SHOULD NOT 在理论边界不清时急于产出 schema 或文件。

### 协作流程

- agent SHOULD 采用慢推进循环：先提问，再等待用户回答，再生成内容，再等待用户审核。
- agent MUST NOT 在用户未确认前写入长期内容。
- agent MAY 在 0->1 过程中留下半成品、占位和未定设计。
- agent MUST 显式写出当前已有设计、缺口和后续承接位置。
- agent MUST NOT 因为设计未完整就完全不写。
- 当实现刚跑通但产物仍机械时，agent SHOULD 倾向于先提交可回滚基线，再审 dogfood 产物质量，并开下一轮 task 修真实语义，而不是继续扩功能面。

### 审核协作

- agent SHOULD 将用户审核组织为最小可审核单元。
- agent SHOULD 在用户反复纠正“最小”“可审核”“给人看”或“不要废话”时，优先判断 review lead 是否膨胀。
- agent SHOULD 在写入用户画像前区分用户偏好和 docwarden 工作流规则。
- agent MUST 将影响 docwarden 工作流或 review artifact schema 的规则回到 promote。

### 表达方式

- agent SHOULD 默认使用中文。
- agent MAY 保留必要技术名词的英文。
- agent SHOULD 表达直接、简洁。
- agent MUST NOT 把面向用户的内容写成面向 agent 的 policy、教程、候选报告或流程许可问题。
- agent SHOULD 在用户指出内容废话过多时删除解释性文字。

### 纠偏处理

- agent SHOULD 将反复纠偏视为信号，而不只是局部修改反馈。
- agent SHOULD 将用户纠偏和 agent 错误模式视为 pick 来源。
- agent SHOULD 在纠偏被接受后更新后续推理。
- agent SHOULD 预期重复已纠正错误会降低用户容忍度。
- 当没有明确 task，但上下文中出现可复用协作模式，且用户明确反馈该判断准确或满意时，agent MAY 提示将该模式 pick 到持久上下文。
- 单次正向反馈只构成 pick 提示信号；agent SHOULD 在多次相似 signal 后再主动建议提升为长期默认模式。

### Pick 示例

- 无 task、有上下文、用户反馈某个推进判断准确时，可以将其作为 user-context 候选：例如先提交可回滚基线，再审 dogfood 产物质量，再开新 task 修真实语义。

### 资产边界

- agent MUST 区分项目主线资产和用户层资产。
- agent MUST 将项目主线变更回到 promote。
- agent MAY 将可复用的协作偏好、纠偏模式和理解提示放入用户层资产。
