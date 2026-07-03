import type { StorySource } from "./types";
import { CITY_KNOWLEDGE } from "./city-knowledge";

const CITY_REFERENCES: Record<string, StorySource[]> = {
  杭州: [
    { label: "杭州市文化广电旅游局", url: "https://wgly.hangzhou.gov.cn/" },
    { label: "杭州文史", url: "https://www.hangzhou.gov.cn/" },
  ],
  上海: [
    { label: "上海市文化和旅游局", url: "https://whlyj.sh.gov.cn/" },
    { label: "上海通", url: "https://www.shtong.gov.cn/" },
  ],
  成都: [
    { label: "成都市文化广电旅游局", url: "https://cdwglj.chengdu.gov.cn/" },
  ],
  西安: [
    { label: "西安市文化和旅游局", url: "https://wlj.xa.gov.cn/" },
  ],
  北京: [
    { label: "北京市文化和旅游局", url: "https://whlyj.beijing.gov.cn/" },
  ],
  重庆: [
    { label: "重庆市文化和旅游发展委员会", url: "https://whlyw.cq.gov.cn/" },
  ],
  深圳: [
    { label: "深圳市文化广电旅游体育局", url: "https://wtl.sz.gov.cn/" },
  ],
  南京: [
    { label: "南京市文化和旅游局", url: "https://wlj.nanjing.gov.cn/" },
  ],
  广州: [
    { label: "广州市文化广电旅游局", url: "https://wglj.gz.gov.cn/" },
  ],
  武汉: [
    { label: "武汉市文化和旅游局", url: "https://wlj.wuhan.gov.cn/" },
  ],
};

export function getStoryQuality(city: string) {
  return {
    curated: Boolean(CITY_KNOWLEDGE[city]),
    sources: CITY_REFERENCES[city] ?? [],
  };
}
