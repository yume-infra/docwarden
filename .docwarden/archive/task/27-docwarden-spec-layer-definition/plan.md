---
status: closed
created: 2026-06-01
updated: 2026-06-02
owner: sayori
---

# Plan

## Step 1: 固化问题

Status: done

目标：明确 task26 产物为什么全错，以及错误如何指向 `spec` 层定义缺失。

验收：

- `discussion-seed.md` 记录当前问题、已知边界、需要用户决策的问题。

## Step 2: 展开 spec 层定位

Status: done

目标：定义 `spec` 服务谁、解决什么损失、和 guide/wiki 的核心差异。

验收：

- 有一组用户审核过的定位判断。

## Step 3: 展开 spec 内部分层

Status: done

目标：明确 `spec` 内部按当前 monorepo 真实资产组织，而不是按 isomorph 内容语言或抽象 repo/product 名组织。

验收：

- `.docwarden/spec/{workspace,apps,packages,harness}/<module>.md` 成为基本结构。
- `kind / module / assertion` 复用 isomorph 已有概念。
- frontmatter 不引入 `mapping` 或 `status`。

## Step 4: 回写 promote 语义

Status: done

目标：把 spec 分层定义映射回 `promote --to spec` 应生成的内容。

验收：

- `promote --to spec` 必须指向 `--target`。
- 无目标时不能生成 task-summary spec。
- 新建 spec module 在 v0 中使用 CLI 内置最小骨架。
- `--kind` 只负责新建 module 的 content kind，不决定 stable spec 目录。

## Step 4.5: 修正层级归属

Status: done

目标：移除 `.docwarden/spec` 中不属于 stable repo state 的 isomorph 概念与结构映射责任。

验收：

- `spec` 概念定义进入 `.isomorph/mapping/docwarden/modules/concept/spec.md`。
- stable structure mapping 进入 `.isomorph/mapping/docwarden/modules/structure/stable-spec-hierarchy.md`。
- `.docwarden/spec/` 只保留当前 monorepo 的 materialized stable modules。

## Step 4.6: 修正实例层组织

Status: done

目标：将 `.docwarden/spec` 的目录从 isomorph content kind 改为当前 monorepo 的真实资产分组。

验收：

- stable spec 目录使用 `workspace/`、`apps/`、`packages/`、`harness/`。
- `policy/workflow/pipeline/composition` 只作为 frontmatter `kind`，不作为 stable spec 目录。
- `promote --to spec` 使用 `--target <asset-group>/<module>`。

## Step 4.7: 贴合当前 monorepo 形态

Status: done

目标：借鉴 Trellis 的真实资产映射思路，但不照搬传统 `frontend/backend` 或泛化 `project/repo/monorepo` 目录。

验收：

- root workspace 资产进入 `workspace/`。
- first-party CLI apps 进入 `apps/`。
- shared config packages 进入 `packages/`。
- `.docwarden` repository maintenance harness 进入 `harness/`。
- 当前 v0 不引入二级 layer，直到 spec 密度需要更细分。

## Step 4.8: 移除 docwarden template 层

Status: done

目标：先让 v0 模型简单，不在 `.docwarden` 中维护 template 层。

验收：

- `.docwarden/template/` 不由 `docwarden init` 创建。
- `promote --to spec` 不暴露 `--template`。
- 缺失 spec module 只由内置最小骨架创建。

## Step 4.9: 修正 init 边界

Status: done

目标：让 `docwarden init` 只铺开 `.docwarden` harness 必要资产，不推断或写死当前仓库的 spec 层级。

验收：

- 已存在 `.docwarden` 时 init 补缺并跳过已有文件，不报 duplicate error。
- init 不覆盖用户已有 harness 文件。
- init 生成的 spec index 不包含固定的 `workspace/apps/packages/harness` 层级说明。
- 当前 monorepo 的真实 spec 层级仍由 dogfood/promote 和 `.isomorph/mapping/docwarden` 承接。

## Step 5: 回到 task26

Status: done

目标：解除 task26 blocker，继续质量 loop。

验收：

- task26 的下一轮实现有清晰 spec target。

## Handoff

Status: done

task26 后续执行不再重新设计 spec 层级。

下一轮 focus：

- 用 `.docwarden/spec/{workspace,apps,packages,harness}/<module>.md` 作为稳定落点。
- 让 review lead 给出具体可审核判断，而不是泛化摘要。
- 让 `promote --to spec` 生成/更新具体 module assertion，而不是 task summary。
- 让 `pick --to wiki` 只承接 side signal 和长期可复用模式。
