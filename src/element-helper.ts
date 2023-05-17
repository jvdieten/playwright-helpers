import { Page, Locator } from "@playwright/test";

export class ElementHelper {

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 
   * @param selector 
   * @returns 
   */
  async clickIfElementExists(selector: string): Promise<void> {
    const yourLocator = this.page.locator(selector)
    const elementIsNotNull = await yourLocator.evaluate(elem => elem !== null);
    if (elementIsNotNull) {
      return await yourLocator.click();
    }
  }

  /**
   * 
   * @param page 
   * @param selector 
   * @returns 
   */
  async elementExists(page: Page, selector: string) {
    const yourLocator = page.locator(selector)
    return await yourLocator.evaluate(elem => elem !== null);
  }

  /**
   * 
   * @param locator 
   * @returns 
   */
  async waitForLocator(locator: Locator): Promise<Locator> {
    await locator.waitFor();
    return locator;
  }


  async confirmElementIsReadyForInteraction(locator: any | Locator) {
    await locator.waitFor({
      state: "attached"
    });
    await locator.waitFor({
      state: "visible"
    });
  }

  async waitForElementInvisibility(locator: any | Locator) {
    await locator.waitFor({
      state: "detached"
    });
  }


  /**
   * 
   * @param selector 
   * @returns 
   */
  async clickHiddenElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
    return await this.page.evaluate((selector): void => {
      const element = document.querySelector(selector);
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      element?.dispatchEvent(clickEvent);
    }, selector);
  }

  /**
   * 
   * @param selector 
   * @param text 
   * @param delay 
   */
  async typeWithDelay(selector: string, text: string, delay = 100) {
    await this.page.waitForSelector(selector);
    const element = this.page.locator(selector);
    for (const char of text) {
      await element.type(char, { delay });
    }
  }


  /**
   * 
   * @param selector 
   * @param attributeName 
   * @returns 
   */
  async getElementAttributeValue(selector: string, attributeName: string): Promise<string | null> {
    await this.page.waitForSelector(selector);
    const element = this.page.locator(selector);
    const attributeValue = await element.getAttribute(attributeName);
    return attributeValue;
  }



  /**
   * 
   * @param selector 
   * @returns <number> 
   */
  async getElementCount(selector: string) {
    const elements = this.page.locator(selector);
    return elements.count;
  }

  /**
   * 
   * @param selector 
   * @param callback 
   */
  async forEachElement(selector: string, callback: (element: Locator, index: number) => Promise<void>) {
    const elements = this.page.locator(selector);
    for (let index = 0; index < await elements.count(); index++) {
      const element = elements.nth(index);
      callback(element, index);
    }
  }

}

