using System;
using System.Threading;

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
            }
            if(args[0].Equals("loop"))
            {
                int num = int.Parse(args[1]);
                if(num>100)
                {
                    System.Console.WriteLine("Too many loops.");
                    return;
                }
                for (int i= 0; i<num; i++)
                {
                    System.Console.WriteLine("Loop:"+i.ToString() +"  Loops :"+num.ToString());
                    Thread.Sleep(1000);
                }
            }
            System.Console.WriteLine("Uncertain parameters");
            return;
        }
    }
}
