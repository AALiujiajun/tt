var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function asyncPool(concurrency, iterable, iteratorFn) {
    return __awaiter(this, void 0, void 0, function* () {
        const executing = new Set();
        function consume() {
            return __awaiter(this, void 0, void 0, function* () {
                const [promise, value] = yield Promise.race(executing);
                executing.delete(promise);
                return value;
            });
        }
        for (const item of iterable) {
            let promise = (() => __awaiter(this, void 0, void 0, function* () { return yield iteratorFn(item); }))().then(value => [promise, value]);
            executing.add(promise);
            if (executing.size >= concurrency) {
                yield consume();
            }
        }
        while (executing.size) {
            yield consume();
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBZ0IsU0FBUyxDQUFtQixXQUFtQixFQUFFLFFBQXFCLEVBQUUsVUFBNEI7O1FBQ3hILE1BQU0sU0FBUyxHQUF1QyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRWhFLFNBQWUsT0FBTzs7Z0JBQ3BCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN2RCxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQixPQUFPLEtBQUssQ0FBQztZQUNmLENBQUM7U0FBQTtRQUVELEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxFQUFFO1lBQzNCLElBQUksT0FBTyxHQUFpQixDQUFDLEdBQVMsRUFBRSxnREFBQyxPQUFBLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBLEdBQUEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuRyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxXQUFXLEVBQUU7Z0JBQ2pDLE1BQU0sT0FBTyxFQUFFLENBQUM7YUFDakI7U0FDRjtRQUNELE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRTtZQUNyQixNQUFNLE9BQU8sRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBJdGVyYXRvckZuPFQsIFI+ID0gKGl0OiBUKSA9PiBQcm9taXNlPFI+XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNQb29sPFQgZXh0ZW5kcyBhbnksIFI+KGNvbmN1cnJlbmN5OiBudW1iZXIsIGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiwgaXRlcmF0b3JGbjogSXRlcmF0b3JGbjxULCBSPikge1xyXG4gIGNvbnN0IGV4ZWN1dGluZzogU2V0PFByb21pc2U8UHJvbWlzZTwoYW55IHwgUilbXT4+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gY29uc3VtZSgpIHtcclxuICAgIGNvbnN0IFtwcm9taXNlLCB2YWx1ZV0gPSBhd2FpdCBQcm9taXNlLnJhY2UoZXhlY3V0aW5nKTtcclxuICAgIGV4ZWN1dGluZy5kZWxldGUocHJvbWlzZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcclxuICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGFueT4gPSAoYXN5bmMgKCkgPT4gYXdhaXQgaXRlcmF0b3JGbihpdGVtKSkoKS50aGVuKHZhbHVlID0+IFtwcm9taXNlLCB2YWx1ZV0pO1xyXG4gICAgZXhlY3V0aW5nLmFkZChwcm9taXNlKTtcclxuICAgIGlmIChleGVjdXRpbmcuc2l6ZSA+PSBjb25jdXJyZW5jeSkge1xyXG4gICAgICBhd2FpdCBjb25zdW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHdoaWxlIChleGVjdXRpbmcuc2l6ZSkge1xyXG4gICAgYXdhaXQgY29uc3VtZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=