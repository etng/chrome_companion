// http://studygolang.com/articles/9643

location.href = decodeURIComponent( document.evaluate('//*[contains(@class, "orig-info")]/p[contains(text(), "查看原文：")]/a', document.body).iterateNext().href.split('=')[1])
