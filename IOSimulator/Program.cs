using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web;

using Newtonsoft.Json;

namespace IOSimulator
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                System.Console.WriteLine("Please enter a numeric argument.");
                return;
                //System.Console.WriteLine("Uncertain parameters");
                //string timestampstring = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                //System.Console.WriteLine("timestampstring:" + timestampstring);
                //System.Console.WriteLine("cu:" + (0.123M).ToString("0.00"));
                //string guidStr = (new Guid()).ToString();
                //WebPaymentData webPaymentData = new WebPaymentData()
                //{
                //    app_id = "b1d8b36713fe4a95",
                //    format = "JSON",
                //    charset = "UTF-8",
                //    sign_type = "MD5",
                //    //sign = _snapPayPaymentSettings.SigningKey,
                //    version = "1.0",
                //    timestamp = timestampstring,
                //    method = "pay.webpay",
                //    merchant_no = "902000028753",
                //    payment_method = "ALIPAY",
                //    out_order_no = guidStr,
                //    trans_currency = "CAD",
                //    description = "测试",
                //    trans_amount = 0.01M,
                //    notify_url = $"http://www.24aibeauti.com/Plugins/PaymentSnapPay/NotifyHandler",
                //    return_url = $"http://www.24aibeauti.com/Plugins/PaymentSnapPay/ReturnHandler?orderno=" + guidStr,
                //    attach = new AttachClass(),
                //    effective_minutes = 30,
                //    browser_type = "PC"
                //};
                //decimal amount = 0.01M;
                //WebPaymentData webPaymentData = new WebPaymentData()
                //{
                //    app_id = "b1d8b36713fe4a95",
                //    format = "JSON",
                //    charset = "UTF-8",
                //    sign_type = "MD5",
                //    //sign = _snapPayPaymentSettings.SigningKey,
                //    version = "1.0",
                //    timestamp = timestampstring,
                //    method = "pay.webpay",
                //    merchant_no = "902000028753",
                //    payment_method = "ALIPAY",
                //    out_order_no = guidStr,
                //    trans_currency = "CAD",
                //    description = "测试",
                //    trans_amount = amount.ToString("0.00"),
                //    notify_url = $"http://www.24aibeauti.com/Plugins/PaymentSnapPay/NotifyHandler",
                //    return_url = $"           
                //    attach = new AttachClass(),
                //    effective_minutes = 30,
                //    browser_type = "PC"
                //};
                //System.Console.WriteLine(GetSign(webPaymentData));
                ////{"code":"E082002","data":[],"msg":"Invalid signature","psn":"03190432071563409993","sign":"6623504a17f6a1e1d0e77127122ba508","total":0}
                ////MyJsonDictionary<string,string> mhd = new Program.MyJsonDictionary<string, string>();
                //IDictionary<string, string> values = JsonConvert.DeserializeObject< IDictionary<string, string> > ("{\"code\":\"E082002\",\"data\":\"[]\",\"msg\":\"Invalid signature\",\"psn\":\"03190432071563409993\",\"sign\":\"6623504a17f6a1e1d0e77127122ba508\",\"total\":\"0\"}");
                //System.Console.WriteLine(GetSign(values));
                //var s = JsonConvert.SerializeObject(values);
                //System.Console.WriteLine(s);
                //string v = "wew";

            }


            if (args[0].Equals("loop"))
            {
                int num = int.Parse(args[1]);
                if (num > 100)
                {
                    System.Console.WriteLine("Too many loops.");
                    return;
                }
                for (int i = 0; i < num; i++)
                {
                    System.Console.WriteLine("Loop:" + i.ToString() + "  Loops :" + num.ToString());
                    Thread.Sleep(1000);
                }
            }

            return;
        }

        public static string GetSign(WebPaymentData webPaymentData)
        {
            string[] parameters = new string[]
            {
                "app_id="+webPaymentData.app_id,
                "browser_type="+webPaymentData.browser_type,
                "charset="+webPaymentData.charset,
                "description="+ webPaymentData.description,
                "effective_minutes="+ webPaymentData.effective_minutes.ToString(),

                "format="+webPaymentData.format,
                "merchant_no="+ webPaymentData.merchant_no,
                "method="+ webPaymentData.method,
                "notify_url="+webPaymentData.notify_url,
                "out_order_no="+ webPaymentData.out_order_no,

                "payment_method="+webPaymentData.payment_method,
                "return_url="+webPaymentData.return_url,
                "timestamp="+ webPaymentData.timestamp,
                "trans_amount="+webPaymentData.trans_amount,
                "trans_currency="+webPaymentData.trans_currency,

                "version="+ webPaymentData.version,
            };
            var oString = string.Join("&", parameters);
            System.Console.WriteLine("oString : " + oString);
            //安全校验码（Key）直接拼接到待签名字符串后面
            oString = oString + "81bdc3019bda15b2aa71f7a1cebfa992";
            string re = "";
            //MD5签名
            using (MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider())
            {
                byte[] data = md5Hasher.ComputeHash(Encoding.UTF8.GetBytes(oString));
                StringBuilder sBuilder = new StringBuilder();

                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                //return sBuilder.ToString().ToLower();
                re = re + sBuilder.ToString().ToLower();
            }
            using (MD5 md5Hasher = MD5.Create())
            {
                byte[] data = md5Hasher.ComputeHash(Encoding.UTF8.GetBytes(oString));
                StringBuilder sBuilder = new StringBuilder();

                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                //return sBuilder.ToString().ToLower();
                return re + "+++++" + sBuilder.ToString().ToLower();
            }
        }
        public static string GetSign(IDictionary<string, string> parameters)
        {
            var vDic = parameters.OrderBy(x => x.Key, new ComparerString()).ToDictionary(x => x.Key, y => y.Value);
            var str = new StringBuilder();
            foreach (var kv in vDic)
            {

                var pvalue = kv.Value;
                if (string.IsNullOrEmpty(pvalue))
                    continue;
                if (kv.Key.Equals("sign_type") || kv.Key.Equals("sign"))
                    continue;
                str.Append(kv.Key).Append("=").Append(pvalue).Append("&");
            }
            //var result = str.Remove(str.Length - 1, 1).ToString();
            var result = str.Remove(str.Length - 1, 1).Append("81bdc3019bda15b2aa71f7a1cebfa992").ToString();
            System.Console.WriteLine(result);
            //MD5签名
            using (MD5CryptoServiceProvider md5Hash = new MD5CryptoServiceProvider())
            {
                byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(result));
                StringBuilder sBuilder = new StringBuilder();

                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                return sBuilder.ToString().ToLower();
            }
        }
        /// <summary>
        /// 对比
        /// </summary>
        public class ComparerString : IComparer<String>
        {
            public int Compare(String x, String y)
            {
                return string.CompareOrdinal(x, y);
            }
        }
        [Serializable]
        public class WebPaymentData
        {
            public string app_id { get; set; }
            public string format { get; set; }
            public string charset { get; set; }
            public string sign_type { get; set; }
            public string sign { get; set; }

            public string version { get; set; }
            public string timestamp { get; set; }
            public string method { get; set; }
            public string merchant_no { get; set; }
            public string payment_method { get; set; }

            public string out_order_no { get; set; }
            public string trans_currency { get; set; }
            public string trans_amount { get; set; }
            public string description { get; set; }
            public string notify_url { get; set; }

            public string return_url { get; set; }
            public AttachClass attach { get; set; }
            public int effective_minutes { get; set; }
            public string browser_type { get; set; }
        }
        [Serializable]
        public class AttachClass { }

        public class ReturnMsg
        {
            //{"code":"E082002","data":[],"msg":"Invalid signature","psn":"03190432071563409993","sign":"6623504a17f6a1e1d0e77127122ba508","total":0}
            public string code { get; set; }
            public Array data { get; set; }
            public string msg { get; set; }
            public string psn { get; set; }
            public string sign { get; set; }
            public string total { get; set; }
        }
        [Serializable]
        public class MyJsonDictionary<K, V> : ISerializable
        {
            Dictionary<K, V> dict = new Dictionary<K, V>();

            public MyJsonDictionary() { }

            //protected MyJsonDictionary(SerializationInfo info, StreamingContext context)
            //{
            //    throw new NotImplementedException();
            //}

            public void GetObjectData(SerializationInfo info, StreamingContext context)
            {
                foreach (K key in dict.Keys)
                {
                    info.AddValue(key.ToString(), dict[key]);
                }
            }

            public void Add(K key, V value)
            {
                dict.Add(key, value);
            }

            public V this[K index]
            {
                set { dict[index] = value; }
                get { return dict[index]; }
            }
        }


    }
}
