using System;
using System.Data.SqlClient;

namespace ERC.Tasks.Models
{
    public class SqlHelper : IDisposable
    {
        private string connString;
        private SqlConnection conn;

        public static object GetValue(object obj)
        {
            if (obj == null) return DBNull.Value;
            return obj;
        }
        public static Int32 ToInt32(object input)
        {
            Int32 val = 0;
            try
            {
                val = Convert.ToInt32(input);
            }
            catch (Exception e)
            {
                // suppress
            }
            return val;
        }
        public static string ToString(object input)
        {
            string val = "";
            try
            {
                val = Convert.ToString(input);
            }
            catch (Exception e)
            {
                // suppress
            }
            return val;
        }
        public static double ToDouble(object input)
        {
            double val = 0;
            try
            {
                val = Convert.ToDouble(input);
            }
            catch (Exception e)
            {
                // suppress
            }
            return val;
        }

        public SqlHelper(string connString)
        {
            this.connString = connString;
            conn = new SqlConnection(this.connString);
            conn.Open();
        }

        public virtual SqlDataReader Query(string q, params SqlParameter[] parameters)
        {
            var command = new SqlCommand(q, conn);
            command.CommandTimeout = 300000;
            if ( parameters != null )
                command.Parameters.AddRange(parameters);
            return command.ExecuteReader();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                    conn = null;
                }
            }
            // free any native resources.. 
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
