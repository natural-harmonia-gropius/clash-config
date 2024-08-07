import { promises as fs } from "fs";
import { join } from "path";
import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const proxy = url.searchParams.get("proxy");

  if (!proxy) {
    return new Response("Missing parameter: proxy", { status: 400 });
  }

  try {
    // 提取主机名
    const host = url.hostname;

    // 构建 base URL
    const baseURL = `${url.protocol}//${host}`;

    // 文件路径为当前目录下的 config.yaml
    const filePath = join(process.cwd(), "app", "api", "config", "config.yaml");
    const yamlContent = await fs.readFile(filePath, "utf-8");

    // 解析 YAML 内容
    const config = YAML.parse(yamlContent);

    // 替换 URL
    config[
      "proxy-providers"
    ].proxy.url = `${baseURL}/api/proxy-provider?proxy=${encodeURIComponent(
      proxy
    )}`;

    // 设置 rule-provider 的 URL
    const ruleProviderUrl = `${baseURL}/api/rule-provider?rule=`;

    config["rule-providers"].direct.url = `${ruleProviderUrl}direct`;
    config["rule-providers"].reject.url = `${ruleProviderUrl}reject`;
    config["rule-providers"].gfw.url = `${ruleProviderUrl}gfw`;
    config["rule-providers"].proxy.url = `${ruleProviderUrl}proxy`;

    // 将修改后的内容转回 YAML 格式
    const updatedYamlContent = YAML.stringify(config);

    return new Response(updatedYamlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml; charset=utf-8",
        "Content-Disposition": `attachment; filename="config.yaml"`,
      },
    });
  } catch (error) {
    return new Response(
      `Unable to process config.yaml file\n\n${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
