# Click Flow License 维护指南

这个 Worker 用于给“自动点击流程台”提供远程开关配置。当前策略是默认免费使用，后续可通过修改 KV 配置开启授权限制。

## 项目位置

```bash
cd C:\tool-project\click-flow-license
```

主要文件：

- `src/index.ts`：Worker 接口逻辑。
- `app-config.json`：远程配置源文件。
- `wrangler.jsonc`：Cloudflare Workers 和 KV 绑定配置。

## 常用接口

部署后线上地址：

```text
https://<your-worker-subdomain>.workers.dev
```

接口：

- `/health`：健康检查。
- `/config`：读取软件远程开关配置。

## 修改远程配置

编辑 `app-config.json`：

```json
{
	"enabled": true,
	"licenseRequired": false,
	"minVersion": "1.0.0",
	"notice": "",
	"cacheTtlHours": 24,
	"freeLimits": {
		"maxProfiles": 999,
		"maxPoints": 9999
	}
}
```

字段说明：

- `enabled`：是否允许软件继续使用。
- `licenseRequired`：是否要求授权。当前保持 `false`，所有人可用。
- `minVersion`：最低可用版本，后续可用于强制升级。
- `notice`：客户端展示的提示文本。
- `cacheTtlHours`：客户端本地缓存有效时长。
- `freeLimits.maxProfiles`：免费方案数量上限。
- `freeLimits.maxPoints`：免费坐标数量上限。

## 写入远端 KV

修改 `app-config.json` 后执行：

```bash
npx wrangler kv key put app-config --binding=APP_CONFIG --path app-config.json --remote
```

注意：必须带 `--remote`，否则只会写入本地开发 KV。

## 部署 Worker

修改 `src/index.ts` 或 `wrangler.jsonc` 后执行：

```bash
npm run deploy
```

只修改 `app-config.json` 时通常不需要重新部署，只需要写入远端 KV。

## 本地测试

```bash
npm test
```

## 线上验证

```bash
curl https://<your-worker-subdomain>.workers.dev/health
curl https://<your-worker-subdomain>.workers.dev/config
```

如果当前网络无法访问 `workers.dev`，可以在 Cloudflare 控制台查看 Worker 部署状态和日志。

## 后续开启限制

把 `app-config.json` 改成：

```json
{
	"enabled": true,
	"licenseRequired": true,
	"minVersion": "1.0.0",
	"notice": "请输入激活码后继续使用",
	"cacheTtlHours": 24,
	"freeLimits": {
		"maxProfiles": 3,
		"maxPoints": 20
	}
}
```

然后写入远端 KV：

```bash
npx wrangler kv key put app-config --binding=APP_CONFIG --path app-config.json --remote
```

## 重要注意事项

- 不要把 Cloudflare API Token、账号密码或私钥提交到仓库。
- 不要在 Electron 客户端写死任何服务端密钥。
- 真正的授权判断后续应放在 Worker 端，客户端只负责展示和缓存结果。
