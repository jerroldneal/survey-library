import { frameworks, url_test, initSurvey, getSurveyResult } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `allTypes`;

var json = {
  questions: [
    {
      type: "text",
      name: "text_question",
    },
    {
      type: "checkbox",
      name: "checkbox_question",
      choices: ["item1"]
    },
  ],
};

const applyTheme = ClientFunction((theme) => {
  Survey.StylesManager.applyTheme(theme);
});
["modern", "bootstrap"].forEach((theme) => {
  frameworks.forEach((framework) => {
    fixture`${framework} ${title}`
      .page`${url_test}${theme}/${framework}.html`.beforeEach(async (t) => {
      await applyTheme(theme);
      await initSurvey(framework, json);
    });
    test("check survey will all types", async (t) => {
      const getQuestionInputIdByName = ClientFunction((name) => {
        let question = survey.getQuestionByName(name);
        return question.inputId;
      });

      await t
        .typeText(
          `input[id=${await getQuestionInputIdByName("text_question")}]`,
          "test text"
        );
      await t.click(Selector("span").withText("item1"));
      await t.click("input[value=Complete]");

      let surveyResult = await getSurveyResult();
      assert.deepEqual(surveyResult, {
        text_question: "test text",
        checkbox_question: ["item1"]
      });
    });
  });
});
